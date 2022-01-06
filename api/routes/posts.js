const express = require("express");
const router = express.Router();
const User=require("../models/User");
const Post = require("../models/Post");
const Category = require("../models/Category");
const {verifyToken,verifyTokenAndAuthorizationForPosts}=require("./verifyToken");


//create post
router.post("/",verifyToken, async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        savedPost.categories.forEach(async(item)=>{
            const categoryFound=await Category.findOne({name:item});
            if(!categoryFound){
                const newCategory = new Category({name:item});
                try {
                    const savedCategory = await newCategory.save();
                } catch (err) {
                    res.status(500).json(err);
                }
            }
        });
        res.status(200).json(savedPost);
    } catch(err) {
        res.status(500).json(err);
    }
});

//update post
router.put("/:id",verifyTokenAndAuthorizationForPosts,async(req,res)=>{
    try{
            const updatedPost=await Post.findByIdAndUpdate(req.params.id,{$set:req.body,},{new:true});
            res.status(200).json(updatedPost);
    } catch(err) {
        res.status(500).json(err);
}
});

//delete post
router.delete("/:id",verifyTokenAndAuthorizationForPosts,async(req,res)=>{
    try {
        await Post.findByIdAndDelete(req.params.id);  // we could also use findByIdAndDelete(req.params.id) but since we have already found the post in previous lines. so we can delete it directly.
        res.status(200).json("Post has been deleted!");
    } catch (err) {
        res.status(500).json(err);
    }
});

//get post
router.get("/:id",async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
});

//get all posts
router.get("/", async(req,res)=>{
    const userName=req.query.user;
    const categoryName=req.query.cat;
    try{
        let posts;
        if(userName) {
            posts=await Post.find({username:userName});
        } else if(categoryName) {
            posts= await Post.find({categories:{
                $in:[categoryName]
            }});
        } else {
            posts=await Post.find();
        }
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json(err);
    }
});
module.exports = router;