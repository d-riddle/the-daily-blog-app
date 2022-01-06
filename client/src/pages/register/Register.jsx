import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import axios from "axios";

function Register(){
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const[errorMessage,setErrorMessage]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setErrorMessage("");
        try{
            const res= await axios.post("/auth/register",{
                username,
                email,
                password
            });
            //console.log(res);
            res.data && window.location.replace("/login");
        } catch(err) {
            if (err.response.data ==="Username and Email must be unique!"){
                setErrorMessage(err.response.data);
            }else {
                setErrorMessage(err.response.data.message);
            }
        }
    }
    return (
        <div className="register">
            <span className="registerTitle">Register</span>
            <form className="registerForm" onSubmit={handleSubmit}>
                <label>Username</label>
                <input 
                type="text" 
                className="registerInput" 
                placeholder="Enter your Username..." 
                onChange={(e)=>setUsername(e.target.value)}
                />
                <label>Email</label>
                <input 
                type="email" 
                className="registerInput" 
                placeholder="Enter your email..." 
                onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input 
                type="password" 
                className="registerInput" 
                placeholder="Enter your password..." 
                onChange={(e) => setPassword(e.target.value)}
                />
                <button className="registerButton" type="submit"><Link to="/register" className="Link">REGISTER</Link></button>
            </form>
            <button className="registerLoginButton"><Link to="/login" className="Link">LOGIN</Link></button>
            {errorMessage && <span style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{errorMessage}</span>}
        </div>
    );
}

export default Register;