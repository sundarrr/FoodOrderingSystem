const express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const register = mongoose.model('User');
const rate = mongoose.model('Rate');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "hotelordering027@gmail.com",
        pass: "foodie027"
    }
});
var rand,mailOptions,host,link;
router.get('/forget',(req,res)=>{
    
});
router.get('/', (req,res)=>{
    console.log('homepage'),
    res.render("home/home");
});
router.get('/SignUp', (req,res)=>{
    console.log('sign up page'),
    res.render("home/SignUp");
});
router.post('/SignUp', (req,res)=>{
    insertRecord(req,res);
});
router.get('/rate', (req,res)=>{
    console.log('Rate Get Successful'),
    res.render("home/rate");
});
router.post('/rate', (req,res)=>{
    console.log('Rate Post Successful'),
    insertrate(req,res);
});
router.get('/login', (req,res)=>{
    console.log('login page'),
    res.render("home/login");
});
var c = new register();    
const check = require('../models/User.model');
router.post('/login', urlencodedParser, function(req, res){
    var name = req.body.username;
    User.findOne({"username":name}, function(err, result) { 
        console.log(req.body.username);
         if (err) {
            return console.log("error: " + err);
          }
        else if (result==null) { 
            console.log(result);
            return res.render("home/login"); 
        } 
        else if (result){ 
            if (c.dec(result.password)==req.body.password) {         
                return res.redirect('/home');
                
            } 
            else { 
                return res.render("home/login", {
                    user: req.body
                });
            } 
        } 
    }); 
});
function insertRecord(req, res) {
    var user = new register();
    console.log(user);
    user.username = req.body.username;
    console.log(req.body);
    user.email = req.body.email;
    //user.setPassword(req.body.password);
    user.password=user.enc(req.body.password);
    var tt=user.enc(req.body.password);
   console.log(user.enc(req.body.password));
   console.log(user.dec(tt));
  //  user.cpassword = req.body.cpassword;
    user.phonenumber = req.body.phonenumber;
    user.save((err, doc) => {
        if (!err){
            rand=Math.floor((Math.random() * 100) + 54);
            host=req.get('host');
            link="http://"+req.get('host')+"/verify?id="+rand;
            mailOptions={
                to : req.body.email,
                subject : "Please confirm your Email account",
                html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response){
             if(error){
                    console.log(error);
                console.log("error");
             }else{
                    console.log("Message sent: " + response.message);
                console.log("sent");
                 }
        });
             res.redirect('/home');
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("home/SignUp", {
                    user: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}
function handleValidationError(err,body){
    for(field in err.errors){
        console.log('username block executed');
        switch(err.errors[field].path){
            case 'username':
                body['UserNameError']=err.errors[field].message;
                break;
            case 'email':
                body['EmailError']=err.errors[field].message;
                break;
            case 'password':
                body['PasswordError']=err.errors[field].message;
                console.log('pass block executed');
                break;
            case 'cpassword':
                body['CPasswordError']=err.errors[field].message;
                break;
            case 'phonenumber':
                body['PhoneNumberError']=err.errors[field].message;
                break;
            deafault:
                break;
        }
    }
}
function insertrate(req, res) {
    var r = new rate();
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    r.Date = mm + '/' + dd + '/' + yyyy;
    r.star=req.body.star;
    r.comment=req.body.comment;
    r.save((err, doc) => {
        if (!err){
             res.redirect('/home');
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("home/rate");
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}
module.exports = router;