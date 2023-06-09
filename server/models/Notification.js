const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message:
    {
        type: String
    },
    contactRequest:
    {
        type: String
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'ContactRequest',
        // required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);