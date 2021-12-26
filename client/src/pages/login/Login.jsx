import "./login.css";
import { Link } from "react-router-dom";
import { useContext, useRef } from "react";
import { Context } from "../../context/Context";
import axios from "axios";

function Login(){
    const userRef=useRef();
    const passwordRef=useRef();
    const {dispatch,isFetching}=useContext(Context);

    const handleSubmit=async (e)=>{
        e.preventDefault();
        //console.log("hi1");
        dispatch({type:"LOGIN_START"});
        try{
            const res=await axios.post("/auth/login",{
                username:userRef.current.value,
                password:passwordRef.current.value
            });
            //console.log(res.data);
            dispatch({type:"LOGIN_SUCCESS",payload:res.data});
        }catch(err) {
            dispatch({type:"LOGIN_FAILURE"});
        }
    }
    //console.log(user);
    return (
        <div className="login">
            <span className="loginTitle">Login</span>
            <form className="loginForm" onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" className="loginInput" placeholder="Enter your Username" ref={userRef} />
                <label>Password</label>
                <input type="password" className="loginInput" placeholder="Enter your password..." ref={passwordRef} />
                <button className="loginButton" type="submit" disabled={isFetching}><Link to="/login" className="Link">Login</Link></button>
            </form>
            <button className="loginRegisterButton"><Link to="/register" className="Link">Register</Link></button>
        </div>
    );
}

export default Login;