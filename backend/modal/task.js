const mongoose = require('mongoose');

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is Required"],
    },
    description:{
        type:String,
    },
    status:{
        type:String,
        enum:['todo','in-progress','done'],
        default:'todo',
    },
    index:{
        type:Number,
        default:0
    }
},
{timestamps:true});

module.exports=mongoose.model('task',taskSchema); 