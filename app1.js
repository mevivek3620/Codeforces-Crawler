const express = require("express");
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");
// const { response } = require("express");

const app = express();

app.set("view engine",'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res)
{
    console.log("Hello");
    res.render("index");
});

app.post("/",function(req,res)
{
    console.log("Vivek");
    // res.render("chart",{});
    
});

app.listen(3000,function(req,res)
{
    console.log("Server is running......");
});