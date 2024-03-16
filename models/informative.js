const mongoose = require('mongoose');

const informativeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    type:{
        type:String, //video,Article etc
    },
    content:{
        type:String,
    },
});

module.exports = mongoose.model("Informative",informativeSchema);