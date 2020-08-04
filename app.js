const express = require("express");
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");
// const { response } = require("express");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res)
{
    console.log("Hello");
    // res.send("<h1>Hello</h1>");result[0].problem.name
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res)
{
    const user = req.body.userName;
    const url ="https://codeforces.com/api/user.info?handles="+user;
    
    https.get(url,function(response)
    {
        var data;
        if(response.statusCode === 200)
        {
            console.log("SUCCESS");
        }
        response.on("data", function(chunk) {
            if (!data) {
              data = chunk;
            } else {
              data += chunk;
            }
          });
      
          response.on("end", function() {
              const info=JSON.parse(data);
            //   console.log(problemData.result[0].maxRank);
              const maxRating = info.result[0].maxRating;
              const rank= info.result[0].rank;
            res.write("<h1>Maximum rating :"+maxRating+"</h1>");
            res.write("<h1>Current Rank :"+rank+"</h1>");
            res.send(); 
          });
    });
    
});


app.listen(3000,function(req,res)
{
    console.log("Server is running......");
});