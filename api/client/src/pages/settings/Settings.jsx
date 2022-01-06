import "./settings.css";
import SideBar from "../../components/sidebar/SideBar.jsx"
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import app from "../../firebase/firebase";
import { axiosInstance } from "../../config";

function Settings(){
    const {user, dispatch}=useContext(Context);
    const [file, setFile] = useState(null);
    const [username, setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [success,setSuccess]=useState(false);
    const [isDeleted,setIsDeleted]=useState(false);
    //const PF="http://localhost:5000/images/";
    const [errorMessage, setErrorMessage] = useState("");
    const [progress, setProgress] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setProgress(""); 
        dispatch({type:"UPDATE_START"});
        const updatedUser = {
            username,
            email,
            password
        };
        if (file) {
            const filename = Date.now() + file.name;
            const storage = getStorage(app);
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log('Upload is ' + uploadProgress + '% done');
                    setProgress('Upload is ' + uploadProgress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        updatedUser.profilePicture = downloadURL;
                        console.log(downloadURL);
                        axiosInstance.put("/users/" + user._id, updatedUser, { headers: { "token": "Bearer " + user.accessToken } }).then((res) => {
                            setSuccess(true);
                            console.log(res.data);
                            dispatch({ type: "UPDATE_SUCCESS", payload: {...res.data,accessToken:user.accessToken }});
                        }).catch((err) => {
                            if (err.response.status === 401 || (err.response.status === 403 && err.response.data === "Token is not valid!")) {
                                dispatch({ type: "LOGOUT" });
                            } else {
                                setErrorMessage(err.response.data);
                            }
                            dispatch({ type: "UPDATE_FAILURE" });
                        });
                    });

                });
        } else {
        try {
            //console.log(user);
            const res = await axiosInstance.put("/users/" + user._id, updatedUser, { headers: { "token": "Bearer " + user.accessToken } });
            setSuccess(true);
            console.log(res.data);
            console.log(res.user);
            dispatch({ type: "UPDATE_SUCCESS", payload: { ...res.data, accessToken: user.accessToken }});
        } catch (err) {
            if (err.response.status === 401 || (err.response.status === 403 && err.response.data === "Token is not valid!")) {
                dispatch({ type: "LOGOUT" });
            } else {
                setErrorMessage(err.response.data);
            }
            dispatch({ type: "UPDATE_FAILURE" });
        }
    }
};

    const handleDelete=async(e)=>{
        e.preventDefault();
        setErrorMessage("");
        if (user.profilePicture) {
            const storage = getStorage(app);

            // Create a reference to the file to delete
            const desertRef = ref(storage, user.profilePicture);

            // Delete the file
            deleteObject(desertRef).then(() => {
                axiosInstance.delete("/users/" + user._id, { headers: { "token": "Bearer " + user.accessToken } }).then(() => {
                    setIsDeleted(true);
                    dispatch({ type: "LOGOUT" });
                }).catch((err) => {
                    if (err.response.status === 401 || (err.response.status === 403 && err.response.data === "Token is not valid!")) {
                        dispatch({ type: "LOGOUT" });
                    } else {
                        setErrorMessage(err.response.data);
                    }
                });
            }).catch((error) => {
                // Uh-oh, an error occurred!
                setErrorMessage(error);
            });
        } else {
            try {
                await axiosInstance.delete("/users/" + user._id, { headers: { "token": "Bearer " + user.accessToken } });
                setIsDeleted(true);
                dispatch({ type: "LOGOUT" });
            } catch (err) {
                if (err.response.status === 401 || (err.response.status === 403 && err.response.data === "Token is not valid!")) {
                    dispatch({ type: "LOGOUT" });
                } else {
                    setErrorMessage(err.response.data);
                }
            }
        }
    }

    return (
        <div className="settings">
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingsUpdateTitle">Update your Account</span>
                    <span className="settingsDeleteTitle" onClick={handleDelete}>Delete your Account</span>
                    {isDeleted && <span style={{ color: "green", textAlign: "center", marginTop: "20px" }}>Profile has been deleted...</span>}
                </div>
                <form className="settingsForm" onSubmit={handleSubmit}>
                    <label>Profile Picture</label>
                    <div className="settingsPP">
                        <img 
                            src={file ? URL.createObjectURL(file) : (user.profilePicture === "" ?"https://firebasestorage.googleapis.com/v0/b/the-daily-blog-app.appspot.com/o/no-profile-picture.jpg?alt=media&token=47007969-643f-4bdd-b942-5f4a44958336":user.profilePicture)}
                            alt=""
                        />
                        <label htmlFor="fileInput">
                            <i class="settingsPPIcon far fa-user-circle"></i>
                        </label>
                        <input id="fileInput" type="file" style={{ display: "none" }} onChange={(e) => { setFile(e.target.files[0]) }}/>
                    </div>
                    <label>Username</label>
                    <input type="text" placeholder={user.username} onChange={(e)=>setUsername(e.target.value)}/>
                    <label>Email</label>
                    <input type="email" placeholder={user.email} onChange={(e)=>setEmail(e.target.value)}/>
                    <label>Password</label>
                    <input type="password" onChange={(e)=>setPassword(e.target.value)}/>
                    <button className="settingsSubmit" type="submit">Update</button>
                    {progress && <span style={{ color: "green", textAlign: "center", marginTop: "20px" }}>{progress}</span>}
                    {success&&<span style={{color:"green",textAlign:"center",marginTop:"20px"}}>Profile has been updated...</span>}
                    {errorMessage && <span style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{errorMessage}</span>}
                </form>
            </div>
            <SideBar />
        </div>
    );
}

export default Settings;