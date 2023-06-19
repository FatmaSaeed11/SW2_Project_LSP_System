//======================= Initiallize Express app =======================
const express = require("express");
const app = express();

// ====================== Global Middleware ====================
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("upload"));
const cors = require("cors");
app.use(cors());

// ====================== Require Moduls  ====================
const auth = require("./routes/Auth");
const books = require("./routes/Books");

// ====================== Run the app  ====================
app.listen( 4000 , "localhost" , ()=>{
    console.log("SERVER IS RUNNING");
});

// ====================== API Routs {EndPOINT}  ====================
app.use("/Auth",auth);
app.use("/Books" , books);
