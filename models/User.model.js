const mongoose = require('mongoose');//888
var crypto = require('crypto');
const algorithm = 'aes-256-cbc';
var password = 'd6F3Efeq';
var passportlocalmongoose=require("passport-local-mongoose");
var usercredentialsSchema = new mongoose.Schema({
   username:{
        type: String,

    },
    email:{
        type:String,

    },
    password:String,
    phonenumber:{
type:Number,
    }
});
var rateSchema = new mongoose.Schema({
    Date: Date,
    star: {type: String, possibleValues: ["very poor","poor","average","good","very good"]},
    comment: String
});
usercredentialsSchema.plugin(passportlocalmongoose);
usercredentialsSchema.methods.enc=function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  };
   
   usercredentialsSchema.methods.dec=   function decrypt(text) {  
       var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  };
usercredentialsSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');
//password must contain Minimum eight characters, at least one letter and one number:
usercredentialsSchema.path('password').validate((val) => {
    console.log('password validation');
    passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(val);
}, 'Your Password must follow the rule');
usercredentialsSchema.path('phonenumber').validate((val) => {
    pnumberRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return pnumberRegex.test(val);
}, 'invalid phone number');

User= mongoose.model('User',usercredentialsSchema);
module.exports = User;
Rate= mongoose.model('Rate',rateSchema);
module.exports = Rate;