import "./login.css";
import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { Context } from "../../context/Context";
import { axiosInstance } from "../../config";

function Login(){
    const userRef=useRef();
    const passwordRef=useRef();
    const {dispatch,isFetching}=useContext(Context);
    const [wrongUsername,setWrongUsername]=useState(false);
    const [wrongPassword,setWrongPassword]=useState(false);
    const [otherServerError,setOtherServerError]=useState(false);

    const handleSubmit=async (e)=>{
        e.preventDefault();
        //console.log("hi1");
        setWrongUsername(false);
        setWrongPassword(false);
        setOtherServerError(false);
        dispatch({type:"LOGIN_START"});
        try{
            const res=await axiosInstance.post("/auth/login",{
                username:userRef.current.value,
                password:passwordRef.current.value
            });
            //console.log(res.data);
            dispatch({type:"LOGIN_SUCCESS",payload:res.data});
        }catch(err) {
            if(err.response.status===400) {
                if(err.response.data==="Wrong Username!"){
                    setWrongUsername(true);
                    setWrongPassword(false);
                    setOtherServerError(false);
                }
                else if(err.response.data==="Wrong Password!") {
                    setWrongUsername(false);
                    setWrongPassword(true);
                    setOtherServerError(false);
                }
            } else {
                setWrongUsername(false);
                setWrongPassword(false);
                setOtherServerError(true);
            }
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
            {wrongUsername && <span style={{ color: "red", textAlign: "center", marginTop: "20px" }}>Wrong Username!</span>}
            {wrongPassword && <span style={{ color: "red", textAlign: "center", marginTop: "20px" }}>Wrong Password!</span>}
            {otherServerError && <span style={{ color: "red", textAlign: "center", marginTop: "20px" }}>Server Error: Something went wrong!</span>}
            <button className="loginRegisterButton"><Link to="/register" className="Link">Register</Link></button>
        </div>
    );
}

export default Login;