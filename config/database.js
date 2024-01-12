
const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = ()=>{
    mongoose.connect(process.env.database_url,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(console.log("connection successfull"))
    .catch((err)=>{console.log("db connection is not successfull error: ",err)})
}

