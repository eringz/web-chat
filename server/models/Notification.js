const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    receiverId:
    {
        type: String
    },
    senderId:
    {
        type: String
    },
    message:
    {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);