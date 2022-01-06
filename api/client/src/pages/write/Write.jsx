import { useContext, useState } from "react";
import "./write.css";
import {Context} from "../../context/Context"
import MDEditor from '@uiw/react-md-editor';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase/firebase";
import { axiosInstance } from "../../config";

function Write(){
    const [title,setTitle] =useState("");
    const [categories,setCategories]=useState([]);
    const [description,setDescription]=useState("");
    const [file,setFile]=useState(null);
    const {user,dispatch}=useContext(Context);
    const [errorMessage,setErrorMessage]=useState("");
    const [progress,setProgress]=useState("");
    
    const handleAddCategories=(currCategory)=>{
        setCategories((prevCategories)=>
            [...prevCategories,currCategory]
        );
    };

    const handleSubmit=async (e)=>{
        e.preventDefault();
        setErrorMessage("");
        setProgress("");       
        const newPost={
            username:user.username,
            userId:user._id,
            title,
            description,
            categories
        };
        if (file) {
            const filename=Date.now()+file.name;
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
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        newPost.photo = downloadURL;
                        console.log(downloadURL);
                        axiosInstance.post("/posts", newPost, { headers: { token: "Bearer " + user?.accessToken } }).then((res)=>{
                            window.location.replace("/post/" + res.data._id);
                        }).catch((err)=>{
                            if (err.response.status === 403 || err.response.status === 401) {
                                dispatch({ type: "LOGOUT" });
                            } else {
                                setErrorMessage("Something Went Wrong!");
                            }
                        });
                    });

                });
        }else{
        try{
            const res=await axiosInstance.post("/posts",newPost,{headers:{token:"Bearer "+user?.accessToken}});
            window.location.replace("/post/"+res.data._id);
        } catch(err){
            if(err.response.status===403||err.response.status===401){
                dispatch({ type: "LOGOUT" });
            } else {
                setErrorMessage("Something Went Wrong!");
            }
        }
    }
    };
    return (
        <div className="write">
        {file && (
            <img className="writeImg" 
                src={URL.createObjectURL(file)}
                alt=""
            />)}
            <form className="writeForm" onSubmit={handleSubmit}>
                <div className="writeFormGroup">
                    <label htmlFor="fileInput">
                        <i class="writeIcon fas fa-plus"></i>
                    </label>
                    <input type="file" id="fileInput" style={{display: "none"}} onChange={(e)=>{setFile(e.target.files[0])}}/>
                    <input type="text" placeholder="Title" className="writeInput" onChange={(e)=>{setTitle(e.target.value)}} />
                </div>
                <div className="writeFormGroupCategory">
                    <div className="writeFormCategoryHeading">
                    <p>Choose the Category of your post</p>
                    </div>
                    <div className="writeFormCategoryOptions">
                        <input type="checkbox" id="Fashion" name="categories" value="Fashion" onChange={(e)=>{e.target.checked&&handleAddCategories(e.target.value)}}/>
                        <label for="Fashion">Fashion</label>

                        <input type="checkbox" id="Food" name="categories" value="Food" onChange={(e) => { e.target.checked && handleAddCategories(e.target.value) }}/>
                        <label for="Food">Food</label>

                        <input type="checkbox" id="Travel" name="categories" value="Travel" onChange={(e) => { e.target.checked && handleAddCategories(e.target.value) }}/>
                        <label for="Travel">Travel</label>

                        <input type="checkbox" id="Music" name="categories" value="Music" onChange={(e) => { e.target.checked && handleAddCategories(e.target.value) }}/>
                        <label for="Music">Music</label>

                        <input type="checkbox" id="Sports" name="categories" value="Sports" onChange={(e) => { e.target.checked && handleAddCategories(e.target.value) }}/>
                        <label for="Sports">Sports</label>

                        <input type="checkbox" id="Education" name="categories" value="Education" onChange={(e) => { e.target.checked && handleAddCategories(e.target.value) }}/>
                        <label for="Education">Education</label>

                        <input type="checkbox" id="Others" name="categories" value="Others" onChange={(e) => { e.target.checked && handleAddCategories(e.target.value) }}/>
                        <label for="Others">Others</label>
                    </div>
                </div>
                <div className="writeFormGroupDescription">
                    <div className="writeFormGroupEditor">
                        <MDEditor
                        value={description}
                        autoFocus={false}
                        onChange={setDescription}
                        height={400}
                        visiableDragbar={true}
                        textareaProps={{ placeholder: 'This is a markdown Editor. Spit your thoughts out...' }}
                        previewOptions={{ skipHtml: true, escapeHtml: true, transformLinkUri: null, linkTarget: '_blank' }}
                        />
                    </div>
                    <div style={{ padding: "50px 0 0 0" }} />
                    <div className="writeFromGroupPreview">
                        <MDEditor.Markdown
                        source={description}
                        skipHtml={true}
                        linkTarget='_blank'
                        transformLinkUri={null} />
                    </div>
                    {//<textarea className="writeInput writeText" placeholder="Spit your thoughts out..." onChange={(e)=>{setDescription(e.target.value)}}></textarea>
                    }
                </div>
                <button className="writeSubmit" type="submit">Publish</button>
                {progress && <span className="writeProgress">{progress}</span>}
                {errorMessage && <span style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{errorMessage}</span>}
            </form>
        </div>
    );
}

export default Write;