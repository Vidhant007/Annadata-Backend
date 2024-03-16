const mongoose = require("mongoose");

const hotspotsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  organisationType: {
    type: String,
    required: [true, "Please provide organization type"],
  },
  description: {
    type: String,
  },
  imageUrl:{
    type:String,
  }
});

module.exports = mongoose.model("Hotspots", hotspotsSchema);