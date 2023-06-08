const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
    receiverId:
    {
        type: String
    },
    senderId:
    {
        type: String
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);