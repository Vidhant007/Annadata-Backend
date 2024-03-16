const mongoose = require("mongoose");

const disasterSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  disasterType: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // image of disaster
  },
  description: {
    type: String,
  },
  QRcode: {
    type: String, //image url
  },
  organisation:{
    type:String, //name of organisation who started relief programme
    required: true
  }
});

module.exports = mongoose.model("Disaster", disasterSchema);