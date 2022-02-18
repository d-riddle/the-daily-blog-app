const express=require("express");
const cors=require("cors");
const app=express();

const dotenv=require("dotenv");
const mongoose = require("mongoose");
const authRoute=require("./routes/auth");
const userRoute=require("./routes/users");
const postRoute=require("./routes/posts");
const categoryRoute=require("./routes/categories");
const path=require("path");

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL,{
    useNewURLParser: true,
    useUnifiedTopology: true,
}).then(console.log("Connected to mongodb")).catch((err)=>console.log(err));


app.use("/api/posts", postRoute);
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/categories",categoryRoute);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});



app.listen(process.env.PORT||5000,()=>{
    console.log("backend is running");
});