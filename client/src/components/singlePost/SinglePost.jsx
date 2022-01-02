import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./singlePost.css";
import MDEditor from '@uiw/react-md-editor';

function SinglePost(){
    const location=useLocation();
    const path=location.pathname.split('/')[2];
    const [post,setPost]=useState({});
    const PF = "http://localhost:5000/images/";
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [updateMode,setUpdateMode]=useState(false);

    useEffect(()=>{
        const getPost=async()=>{
            const res=await axios.get("/posts/"+path);
            setPost(res.data);
            setTitle(res.data.title);
            setDescription(res.data.description);
        }
        getPost();
    },[path]);
    const {user}=useContext(Context);
    const handleDelete= async()=>{
        try{
            await axios.delete("/posts/"+path,{data:{username:user.username}});
            window.location.replace("/");
        } catch(err){

        }
    };
    const handleUpdate= async()=>{
        try{
            await axios.put("/posts/"+path,{
                username:user.username,
                title:title,
                description:description
            });
            window.location.reload();
        } catch(err){

        }
    };    
    return (
        <div className="singlePost">
            <div className="singlePostWrapper">
            {post.photo && (
                <img src={PF+post.photo}
                    alt=""
                    className="singlePostImg" />
            )}
            {updateMode?(
                <input type="text" value={title} className="singlePostTitleInput" autoFocus onChange={(e)=>setTitle(e.target.value)}/>
            ) : (
                <h1 className="singlePostTitle">
                    {post.title}
                    {post.username===user?.username&&(
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
                    //<textarea className="singlePostDescriptionInput" value={description} onChange={(e)=>setDescription(e.target.value)} />

                ):(
                //<p className="singlePostDescription">
                  //  {post.description}
                //</p> 
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
            </div>
        </div>
    );
}

export default SinglePost;