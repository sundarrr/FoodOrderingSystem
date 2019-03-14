const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Food_Ordering_System',{ useNewUrlParser:true},(err)=>{
    if(!err){
        console.log('Mongo Connection Succeeded')
    }
    else{
        console.log('Error in DB Connection: '+err)
    }
});

require('./User.model');