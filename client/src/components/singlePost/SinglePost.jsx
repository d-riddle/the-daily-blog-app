import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./singlePost.css";
import MDEditor from '@uiw/react-md-editor';
import { getStorage, ref, deleteObject } from "firebase/storage";
import app from "../../firebase/firebase";
import { axiosInstance } from "../../config";

function SinglePost(){
    const location=useLocation();
    const path=location.pathname.split('/')[2];
    const [post,setPost]=useState({});
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [updateMode,setUpdateMode]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");

    useEffect(()=>{
        const getPost=async()=>{
            const res=await axiosInstance.get("/posts/"+path);
            setPost(res.data);
            setTitle(res.data.title);
            setDescription(res.data.description);
        }
        getPost();
        setErrorMessage("");
    },[path]);
    const {user,dispatch}=useContext(Context);
    const handleDelete= async()=>{
        setErrorMessage("");
        if(post.photo){
        const storage = getStorage(app);

        // Create a reference to the file to delete
        const desertRef = ref(storage,post.photo );

        // Delete the file
        deleteObject(desertRef).then(() => {
            axiosInstance.delete("/posts/" + path,{ headers: { "token": "Bearer " + user.accessToken } }).then(()=>{
                window.location.replace("/");
            }).catch((err)=>{
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
    }else{
        try{
            await axiosInstance.delete("/posts/" + path,{ headers: { "token": "Bearer " + user.accessToken } });
            window.location.replace("/");
        } catch(err){
            if (err.response.status === 401 || (err.response.status === 403 && err.response.data ==="Token is not valid!")){
                dispatch({type:"LOGOUT"});
            } else {
                setErrorMessage(err.response.data);
            }
        }
    }
    };
    const handleUpdate= async()=>{
        setErrorMessage("");
        try{
            await axiosInstance.put("/posts/"+path,{
                title:title,
                description:description
            }, { headers: { "token": "Bearer " + user.accessToken } });
            window.location.reload();
        }catch(err){
            //console.log(err);
            if (err.response.status === 401 || (err.response.status === 403 && err.response.data === "Token is not valid!")) {
                dispatch({ type: "LOGOUT" });
            } else {
                setErrorMessage(err.response.data);
            }
        }
    };    
    return (
        <div className="singlePost">
            <div className="singlePostWrapper">
            {post.photo && (
                <img src={post.photo}
                    alt=""
                    className="singlePostImg" />
            )}
            {updateMode?(
                <input type="text" value={title} className="singlePostTitleInput" autoFocus onChange={(e)=>setTitle(e.target.value)}/>
            ) : (
                <h1 className="singlePostTitle">
                    {post.title}
                    {(post.username===user?.username||user?.isAdmin)&&(
                    <div className="singlePostEdit">
                        <i class="singlePostIcon far fa-edit" onClick={()=>setUpdateMode(true)}></i>
                        <i class="singlePostIcon far fa-trash-alt" onClick={handleDelete}></i>
                    </div>
                    )}
                </h1>
                )}
                <div className="singlePostInfo">
                    <span className="singlePostAuthor">
                        Author: 
                        <Link to={`/?user=${post.username}`} className="Link">
                            <b>{post.username}</b>
                        </Link> 
                    </span>
                    <span className="singlePostDate">{new Date(post.createdAt).toDateString()}</span>
                </div>
                {updateMode?(
                    <div className="singlePostDescription">
                        <div className="singlePostEditor">
                            <MDEditor
                                value={description}
                                autoFocus={false}
                                onChange={setDescription}
                                height={400}
                                visiableDragbar={true}
                                previewOptions={{ skipHtml: true, escapeHtml: true, transformLinkUri: null, linkTarget: '_blank' }}
                            />
                        </div>
                        <div style={{ padding: "50px 0 0 0" }} />
                        <div className="singlePostPreview">
                            <MDEditor.Markdown
                                source={description}
                                skipHtml={true}
                                linkTarget='_blank'
                                transformLinkUri={null} />
                        </div>
                    </div>

                ):(
                <div className="singlePostPreviewUpdateOff">
                    <MDEditor.Markdown
                        source={description}
                        skipHtml={true}
                        linkTarget='_blank'
                        transformLinkUri={null} />
                </div>
                )}
                {updateMode&&(
                <button className="singlePostButton" onClick={handleUpdate}>Update</button>
                )}
                {errorMessage && <span style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{errorMessage}</span>}
            </div>
        </div>
    );
}

export default SinglePost;