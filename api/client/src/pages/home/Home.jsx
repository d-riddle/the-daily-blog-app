import { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Posts from '../../components/posts/Posts';
import SideBar from '../../components/sidebar/SideBar';
import './home.css';
import {useLocation} from "react-router";
import { axiosInstance } from '../../config';

function Home(){
    const [posts,setPosts]=useState([]);
    const {search} = useLocation();
    useEffect(()=>{
        const fetchPosts=async()=>{
            const res= await axiosInstance.get("/posts"+search);
            setPosts(res.data);
        }
        fetchPosts();
    }, [search]);  // we can pass an empty array ([]) as a second argument. This tells React that your effect doesn’t depend on any values from props or state, so it never needs to re-run.

    return(
        <>
        <Header />
        <div className="home">
            <Posts posts={posts} />
            <SideBar />
        </div>
        </>
    );
}

export default Home;