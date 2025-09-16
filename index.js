const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
    "mongodb+srv://rifaya:nashwan21@cluster0.ciu9ybk.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
)
.then(function(data){
    console.log("connected to DB");
})
.catch(function(){
    console.log("Failed to connect");
});

const credential = mongoose.model("credential", {}, "bulkmail");

app.post("/sendemail", function(req, res) {
    var msg = req.body.msg;
    var emaillist = req.body.emaillist;

    credential.find().then(function(data) {
        console.log(data[0].toJSON());
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        new Promise(async function(resolve, reject) {
            try {
                for (var i = 0; i < emaillist.length; i++) {
                    await transporter.sendMail({
                        from: "rifayasafi11@gmail.com",
                        to: emaillist[i],
                        subject: "A message from Bulk Mail App",
                        text: msg
                    });
                    console.log("Email sent to:" + emaillist[i]);
                }
                resolve("success");
            } catch(error) {
                reject("Failed");
            }
        }).then(function() {
            res.send(true);
        }).catch(function() {
            res.send(false);
        });

    }).catch(function(error){
        console.log(error);
    });
});

app.listen(5000, function() {
    console.log("server started...");
});
