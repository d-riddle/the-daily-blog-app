const jwt=require("jsonwebtoken");
const Post = require("../models/Post");


const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.token;
    if(authHeader){
        //console.log(authHeader);
        const token=authHeader.split(" ")[1];
        //console.log(token);
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return res.status(403).json("Token is not valid!");
            }
            //console.log(user);
            req.user=user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }  
};

const verifyTokenAndAuthorizationForUserSettings=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.userId===req.params.id||req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

const verifyTokenAndAuthorizationForPosts = (req, res, next) => {
    verifyToken(req, res,async () => {
        try{
            const post =await Post.findById(req.params.id);
            if (req.user.userId === post.userId || req.user.isAdmin) {
                next();
            } else {
                res.status(403).json("You are not allowed to do that!");
            }
        }catch(err){
            res.status(500).json(err);
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not an admin!");
        }
    });
};
module.exports = { verifyToken, verifyTokenAndAuthorizationForUserSettings,verifyTokenAndAuthorizationForPosts,verifyTokenAndAdmin};