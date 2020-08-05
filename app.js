const express = require("express");
const https = require("https");
const request = require("request");
// const ejs = require("ejs");
const bodyParser = require("body-parser");
// const { response } = require("express");

const app = express();

app.set("view engine",'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res)
{
    console.log("Hello");
    // res.send("<h1>Hello</h1>");result[0].problem.name
    res.render("index");
});

app.post("/",function(req,res)
{
    var ranks =[];
    var ratings = [];
    const user = req.body.userName;
    const url ="https://codeforces.com/api/user.rating?handle="+user;
    
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
            const contest = JSON.parse(data);
            const numberOfContests = contest.result.length;
            for(var i=0;i<numberOfContests;i++)
            {
                ranks.push(contest.result[i].rank);
                if(i!=0)ratings.push(contest.result[i].newRating-contest.result[i].oldRating);
                if(i==0)ratings.push(contest.result[i].newRating-1500);
            }
            const currRating = ratings[numberOfContests-1];
            ranks.sort(function(a, b){return a-b});
            ratings.sort(function(a, b){return a-b});

            // const maxRating = info.result[0].maxRating;
            // const rank = info.result[0].rank;
            // res.write("<h1>Number of contests :"+numberOfContests+"</h1>");
            // res.write("<h1>Maximum up :"+ratings[numberOfContests-1]+"</h1>");
            // res.write("<h1>Maximum down :"+ratings[0]+"</h1>");
            // res.write("<h1>Best Rank :"+ranks[0]+"</h1>");
            // res.write("<h1>Worst Rank :"+ranks[numberOfContests-1]+"</h1>");
            // res.send(); 
            res.render("user",{rating:currRating});
        });
    });
    
});


app.listen(3000,function(req,res)
{
    console.log("Server is running......");
});