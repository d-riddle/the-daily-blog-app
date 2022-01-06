const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const Post = require("../models/Post");
const {verifyTokenAndAuthorizationForUserSettings,verifyTokenAndAdmin}=require("./verifyToken");

//update
router.put("/:id",verifyTokenAndAuthorizationForUserSettings, async (req, res) => {
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser= await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
});

//delete
router.delete("/:id",verifyTokenAndAuthorizationForUserSettings, async (req, res) => {
        try {
            const user=await User.findById(req.params.id);
            if(user) {
                try {
                    await Post.deleteMany({username:user.username});
                    await User.findByIdAndDelete(req.params.id);
                    res.status(200).json("User has been deleted.");
                } catch (err) {
                    res.status(500).json(err);
                }
            }
        } catch(err) {
            res.status(404).json(err);
        }
});

//get user
router.get("/:id",verifyTokenAndAdmin, async (req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        const {password,...others}=user._doc;
        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err);
    }
});

//get all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;