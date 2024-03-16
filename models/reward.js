const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    productName:{
        type:String,
    },
    productImage:{
        type:String,
    },
    costPoints:{
        type:Number,
    },
    productDescription:{
        type:String,
    },
    impact:{
        type:String,
    }


});

module.exports = mongoose.model("Reward",rewardSchema);