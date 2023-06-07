const mongoose = require('mongoose');

const contactRequestSchemae = new mongoose.Schema({
    senderId:
    {
        type: String
    },
    receiverId:
    {
        type: String
    }
}, 
{
    timestamps: true
})