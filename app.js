//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/usersDB");

app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});
const User = new mongoose.model("User",userSchema);


app.get("/",function(req, res){
  res.render("home.ejs");
});
app.get("/login",function(req, res){
  res.render("login.ejs");
});
app.get("/register",function(req, res){
  res.render("register.ejs");
});

app.post("/register", function(req, res){
const username = req.body.username;
const password = req.body.password;

const user = new User({
  email: username,
  password: password
});
user.save(function(err){
  if(err){
    console.log(err);
  }else{
    res.render("secrets.ejs");
  }
});

});

app.post("/login", function(req, res){

const username = req.body.username;
const password = req.body.password;

User.findOne({email: username}, function(err, found){
  if(err){
    console.log(err);
  }else{
    if(found){
      if(found.password == password)
      {
        res.render("secrets.ejs");
      }
      else{
        console.log("password didnt matched");
      }
    }
  }
});

});



app.listen(3000, function(){
  console.log("server started on port 3000");
});
