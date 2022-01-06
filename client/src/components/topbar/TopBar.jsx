import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import './topbar.css'

function TopBar(){
    const {user,dispatch}=useContext(Context);
    //const PF = "http://localhost:5000/images/";
    const handleLogout=()=>{
        dispatch({type:"LOGOUT"});
    }
    return(
        <div className="top">
            <div className="topLeft">
                <a href="https://www.facebook.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="fab fa-facebook-square"></i></a>
                <a href="https://www.instagram.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="fab fa-pinterest-square"></i></a>
                <a href="https://www.pinterest.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="fab fa-twitter-square"></i></a>
                <a href="https://twitter.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="fab fa-instagram-square"></i></a>
            </div>
            <div className="topCenter">
                <ul className="topList">
                    <li className="topListItem"><Link className="Link" to="/">HOME</Link></li>
                    <li className="topListItem"><Link className="Link" to="/contact">CONTACT</Link></li>
                    <li className="topListItem"><Link className="Link" to="/write">WRITE</Link></li>
                    <li className="topListItem" onClick={handleLogout}>{user&&"LOGOUT"}</li>
                </ul>
            </div>
            <div className="topRight">
                {
                    user?(
                        <Link className="Link" to="/settings">
                            <img className="topImg" src={user.profilePicture === "" ?"https://firebasestorage.googleapis.com/v0/b/the-daily-blog-app.appspot.com/o/no-profile-picture.jpg?alt=media&token=47007969-643f-4bdd-b942-5f4a44958336":user.profilePicture} alt="" />
                        </Link>
                    ):
                    (
                        <ul className="topList">
                            <li className="topListItem"><Link className="Link" to="/login">LOGIN</Link></li>
                            <li className="topListItem"><Link className="Link" to="/register">REGISTER</Link></li>
                        </ul>
                    )}
                <i class="topSearchIcon fas fa-search"></i>
            </div>
        </div>
    );
}

export default TopBar;