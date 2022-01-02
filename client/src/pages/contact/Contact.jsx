import './contact.css';
import emailjs from '@emailjs/browser';
import { useState } from 'react';




function Contact(){
    const [isMailSent,setMailSent]=useState(false);
    const handleSubmit=(e)=>{
        e.preventDefault();
        // console.log(process.env.REACT_APP_TEMPLATEID);
        // console.log(process.env.REACT_APP_EMAILJS_USERID);
        // console.log(process.env.REACT_APP_SERVICEID);
        emailjs.sendForm(process.env.REACT_APP_SERVICEID, 
        process.env.REACT_APP_TEMPLATEID,
        e.target, 
        process.env.REACT_APP_EMAILJS_USERID
         ).then((res)=>{
            console.log(res);
            setMailSent(true);
        }).catch((err)=>{
            console.log(err);
        });
    };
    return (
        <div className="contact">
            <h1 className="heading">Contact Me</h1>
            <form className="formGroup" onSubmit={handleSubmit}>
                <label for="formName" className='formLabel'>Name:</label>
                <input type="text" className="formName" id="formName" placeholder='Enter your Name' name="name"/>
                <label for="formEmail" className="formLabel">Email:</label>
                <input type="email" className="formEmail" id="formEmail" placeholder='Enter your Email' name="email"/>
                <label for="formMessage" className='formLabel'>Message:</label>
                <textarea className="formMessage" id="formMessage" placeholder='Enter Your Message' name="message"></textarea>
                <button type="submit" className='formSubmit'>Send</button>
            </form>
            {isMailSent&&(<p className='confirmer'>Mail sent successfully...</p>)}
        </div>
    );

}

export default Contact;