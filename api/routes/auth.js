const express = require("express");
const router=express.Router();
const User=require("../models/User");
const bcrypt = require('bcrypt');

//register
router.post("/register",async (req,res)=>{
            try {
                const salt=await bcrypt.genSalt(10);
                const hashPassword=await bcrypt.hash(req.body.password,salt);
                const newUser= new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashPassword
                });
                const user= await newUser.save();
                res.status(200).json(user);
            } catch(err) {
                res.status(500).json(err);
            }
});

//login
router.post("/login",async (req,res)=>{
    try{
        const user=await User.findOne({username: req.body.username});
        !user && res.status(400).json("Wrong credentials");

        const validate=await bcrypt.compare(req.body.password,user.password);
        !validate && res.status(400).json("Wrong credentials");
        
        const {password, ...others}=user._doc;
        res.status(200).json(others);
    } catch {
        res.status(500).json(err);
    }
});

// //test route
// router.get("/", async (req, res) => {
//     try {
//         console.log("hi from auth get");
//         res.send("hi from auth get");
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
module.exports=router;