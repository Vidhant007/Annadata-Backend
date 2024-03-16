const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide username"],
    },
    phone: {
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
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        minlength: 3,
        maxlength: 50,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
    },
    organisation: {
        type: String,
        required: [true, "Please add your organization"],
    },
    points: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Volunteer', volunteerSchema);