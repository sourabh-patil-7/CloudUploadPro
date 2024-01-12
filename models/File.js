const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
});

fileSchema.post("save", async (doc) => {
  try {
    console.log("doc : ", doc);

    //shift this transporter to configuration
    let transporter = nodemailer.createTransport({
      host: process.env.mail_host,
      auth: {
        user: process.env.mail_user,
        pass: process.env.mail_pass,
      },
    });

    let info = transporter.sendMail({
      from: "Sourabh Patil",
      to: doc.email,
      subject: "New file updated at cloudinary",
      html: `<h1>Hello jee</h1> <p>File is uploaded</p>
                    click on the link to see : <a href="${doc.imageUrl}">${doc.imageUrl}</a>`,
    });

    console.log("info", info);
  } catch (error) {
    console.log(error);
  }
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
