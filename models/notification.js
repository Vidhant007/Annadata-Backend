const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    messages: {
        type: [String],
        required: true,
    },
    status: {
        type: String,
        enum: ['seen', 'unseen'],
        default: 'unseen',
    },
    priority: {
        type: Number,
    },
});

module.exports = mongoose.model('Notifications', notificationSchema);