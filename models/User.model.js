const mongoose = require('mongoose');
var crypto = require('crypto'); 
var passportlocalmongoose=require("passport-local-mongoose");
var usercredentialsSchema = new mongoose.Schema({
   username:{
        type: String

    },
    email:{
        type:String

    },
    hash : String, 
    salt : String ,
    phonenumber:{
type:Number
    }
});
usercredentialsSchema.plugin(passportlocalmongoose);
usercredentialsSchema.methods.setPassword = function(password) { 
     
    // creating a unique salt for a particularusercredentials 
       this.salt = crypto.randomBytes(16).toString('hex'); 
     
       // hashingusercredentials's salt and password with 1000 iterations, 
       this.hash = crypto.pbkdf2Sync(password, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
   }; 

  usercredentialsSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password,this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
}; 

usercredentialsSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');
//password must contain Minimum eight characters, at least one letter and one number:
/*usercredentialsSchema.path('password').validate((val) => {
    passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(val);
}, 'Your Password must follow the rule');*/
usercredentialsSchema.path('phonenumber').validate((val) => {
    pnumberRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return pnumberRegex.test(val);
}, 'invalid phone number');

User= mongoose.model('User',usercredentialsSchema);
module.exports = User;