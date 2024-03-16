const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    productName:{
        type:String,
    },
    imageUrl:{
        type:String,
    },
    costPoints:{
        type:Number,
    },
    productDescription:{
        type:String,
    },
});

module.exports = mongoose.model("Reward",rewardSchema);