import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

function SideBar(){
    const [categories,setCategories]=useState([]);
    const PF = "http://localhost:5000/images/";
    useEffect(()=>{
        const getCategories=async()=>{
            const res=await axios.get("/categories");
            setCategories(res.data);
        }
        getCategories();
    },[]);
    return (
        <div className="sidebar">
            <div className="sidebarItem">
                <span className="sidebarTitle">ABOUT ME</span>
                <img className="sidebarImg" src={PF+"aboutme-sidebar-picture.jpg"} alt="" />
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            <div class="sidebarItem">
                <span className="sidebarTitle">CATEGORIES</span>
                <ul className="sidebarList">
                {categories.map((c)=>(
                    <Link to={`/?cat=${c.name}`} className="Link">
                        <li className="sidebarListItem">{c.name}</li>
                    </Link>
                ))}
                </ul>
            </div>
            <div className="sidebarItem">
                <span className="sidebarTitle">FOLLOW US</span>
                <div className="sidebarSocial">
                    <a href="https://www.facebook.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="sidebarIcon fab fa-facebook-square"></i></a>
                    <a href="https://www.pinterest.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="sidebarIcon fab fa-pinterest-square"></i></a>
                    <a href="https://twitter.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="sidebarIcon fab fa-twitter-square"></i></a>
                    <a href="https://www.instagram.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="sidebarIcon fab fa-instagram-square"></i></a>
                </div>
            </div>
        </div>
    );
}

export default SideBar;