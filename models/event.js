const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String, //not coordinates just address
    required: true,
  },
  imageUrl: { //organisation logo
    type: String,
  },
  contact: {
    type: Number,
    required: [true, "Please provide a phone number"],
    validate: {
      validator: function (value) {
        // Use a regular expression to validate the phone number format
        return /^[0-9]{10}$/.test(value);
      },
      message: "Please provide a valid 10-digit phone number",
    },
  },
  register: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor", // gets info by using id from db and automaticatically registers 
  },
  description:{
    type:String,
    required:true,
  }
});

module.exports = mongoose.model("Event", eventSchema)