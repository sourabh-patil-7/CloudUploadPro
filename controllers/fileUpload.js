
const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();


exports.localFileUpload = async (req,res)=>{
    try
    {
        const file = req.files.file;
        console.log("file is : ",file);
        
        //define the path to save it on the server
        let ext = file.name.split('.')[1];
        let path = __dirname + "/files/" + Date.now() +  "." + ext;
        console.log("Path is : ",path);

        file.mv(path,(error)=>{
            console.log(error);
        });

        return res.json({
            success:true,
            message:"file uploaded successfully"
        });

    }catch(error){
        console.log("problem while uploading the file");
        return res.json({
            success:false,
            message:`something went wrong : ${error}`
        })
    }
}

function isSupportedFileType(supported,ext)
{
    return supported.includes(ext);
}

function checkfileSize(file)
{
    return file.size < 5e+6;
}

//function to upload the file to cloudinary
async function uploadToCloudinary(file,folder,quality)
{
    const options = {folder};

    //this will automatically detect the file type 
    options.resource_type = "auto";
    //add the quality attribute to the options
    options.quality = quality;
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}


exports.imageUpload = async (req,res) =>{
    try{

        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        let file = req.files.imagefile;
        console.log(file);

        //check if it is supported file type or not ;
        const supported = ["jpg","jpeg","png"];
        const ext = file.name.split(".")[1].toLowerCase();
        let check = isSupportedFileType(supported,ext);

        //check the file size is less than 5mb or not
        const flag = checkfileSize(file);
        if(!flag)
        {
            console.log("file size too large");
            return res.status(400).json({
                success:false,
                message:"large file size"
            })
        }

        if(!check)
        {
            return res.status(400).json({
                success:false,
                message:"This file type is not supported"
            })
        }

        folder = process.env.folder;
        const response = await uploadToCloudinary(file,folder);
        console.log("response : ",response);

        // save the entry in db
        const dbentry = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url
        })


        
        return res.status(200).json({
            success:true,
            imageUrl : response.secure_url,
            message:"image uploaded successfully"
        })

        

    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            messsage:"something went wrong : "
        })
    }
}

exports.videoUpload = async(req,res)=>{
    try{
        const {name,email,tags} = req.body;
        console.log(name,email,tags);

        const file = req.files.videofile;
        console.log(file);

        //check if it is supported file type or not ;
        const supported = ["mp4","mov"];
        const ext = file.name.split(".")[1].toLowerCase();
        let check = isSupportedFileType(supported,ext);

        console.log("hi")
        
        //homework add a upper limit of 5mb file size
        const flag = checkfileSize(file);
        if(!flag)
        {
            console.log("file size too large");
            return res.status(400).json({
                success:false,
                message:"large file size"
            })
        }

        if(!check)
        {
            return res.status(400).json({
                success:false,
                message:"This file type is not supported"
            })
        }

        folder = process.env.folder;
        const response = await uploadToCloudinary(file,folder);
        console.log("response : ",response);

        const dbentry = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url
        })

        return res.status(200).json({
            success:true,
            message:"video uploaded successfully"
        })


    }catch(error){
        console.log("something went wrong");
        return res.status(400).json({
            success:false,
            message:"video not uploaded"
        })
    }
}



exports.imageSizeReducer = async (req,res) =>{
    try{

        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        let file = req.files.imagefile;
        console.log(file);

        //check if it is supported file type or not ;
        const supported = ["jpg","jpeg","png"];
        const ext = file.name.split(".")[1].toLowerCase();
        let check = isSupportedFileType(supported,ext);

        //homework : upper limit should be less than 5mb create it
        if(!check)
        {
            return res.status(400).json({
                success:false,
                message:"This file type is not supported"
            })
        }

        folder = process.env.folder;
        const response = await uploadToCloudinary(file,folder,40);
        console.log("response : ",response);

        // save the entry in db
        const dbentry = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url
        })


        return res.status(200).json({
            success:true,
            imageUrl : response.secure_url,
            message:"image uploaded successfully"
        })

        

    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            messsage:"something went wrong : "
        })
    }
}