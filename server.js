// LIBRARIES INPORT SECTION
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

// CONFIGURE SERVER
const app = express();
const corsOptions = {
  origin: "localhost:3000",
};

app.use(bodyParser.json());

// CONFIGURATION OF LIBRARIES
app.use("/upload", express.static(__dirname + "/upload")); // TO ACCESS IMAGE IN BROWSER USING IMAGE URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());// (MIDDLEWARE) THAT PARSES THE INCOMING REQUEST BODIES IN A MIDDLEWARE BEFORE YOUR HANDLERS.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload()); // FOR THE FILE UPLOAD
app.use(cors(corsOptions));// MIDDLEWARE


const db = require("./app/config/db.config");
//Create table if not exists
db.sequelize.sync();

// app.use("/demo", (req, res)=>{
//     console.log("Recieved request");
//     res.status(200).send("As an captain of team India/Bharat Rohit sharma lifted ICC 2023 ODI worldcup trophy");
// });

// ENABLE ALL ROUTES FROM OTHER FILE WHICH IS LOCATED IN app/index.js
app.use("/", require("./app/routes "));


// SERVER WITH PORT
const PORT = 3000
const Server = app.listen(PORT, ()=>{
    console.log(`Server Started on http://localhost:${PORT}/`);
});