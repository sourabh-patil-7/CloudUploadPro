
const express = require("express");
const app = express();

require("dotenv").config();

//finding the port from the .env file
const port = process.env.port || 8000;

//add middleware
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//connect with db
const dbconnect = require("./config/database");
dbconnect.dbConnect();

//connect with cloud
const cloud = require("./config/clodinary");
cloud.cloudinaryConnect();

//api route
const upload = require("./routes/file");
app.use("/api/v1/upload",upload);


//activate user 
app.listen(port,(req,res)=>{
    console.log("server started at port Number : ",port);
});

//default route
app.get("/",(req,res)=>{
    res.send("<h1>This is the homepage </h1>");    
});

