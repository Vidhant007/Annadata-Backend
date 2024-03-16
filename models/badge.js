const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    badgeID:{
        type:String,
    },
    badgeName:{
        type:String,
    },
    description:{
        type:String,
    },
    pointsRequired:{
        type:Number,
    }
});

module.exports = mongoose.model("Badge",badgeSchema);

