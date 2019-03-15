const express = require('express');
var router = express.Router();
const path = require ('path');
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const register = mongoose.model('User');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var bcrypt = require('bcrypt');
router.get('/', (req,res)=>{
    console.log('summma'),
    res.render("home/home");
});
router.get('/SignUp', (req,res)=>{
    console.log('sign up poiduchu'),
    res.render("home/SignUp");
});
router.post('/SignUp', (req,res)=>{
    insertRecord(req,res);
});
router.get('/login', (req,res)=>{
    console.log('login  poiduchu'),
    res.render("home/login");
});
var c = new register();    
const check = require('../models/User.model');
router.post('/login', urlencodedParser, function(req, res){
    check.findOne({username: req.body.username }, function(err, user) { 
        if (user === null) { 
            return res.status(400).send({ 
                message : "User not found."
           }); 
        } 
        else { 
            if (c.dec(user.password)==req.body.password) {                
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
    user.username = req.body.username;
    user.email = req.body.email;
    //user.setPassword(req.body.password);
    user.password=user.enc(req.body.password);
    var tt=user.enc(req.body.password);
   console.log(user.enc(req.body.password));
   console.log(user.dec(tt));
  //  user.cpassword = req.body.cpassword;
    user.phonenumber = req.body.phonenumber;
    user.save((err, doc) => {
        if (!err)
             res.redirect('/home');
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
module.exports = router;
