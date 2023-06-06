const mongoose = require('mongoose');
require('./models/User');
require('./models/Chatroom');
require('./models/Message');

const messageSchema = new mongoose.Schema({
    chatroom: 
    {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Chatroom is required',
        ref: 'Chatroom'
    },
    user: 
    {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Chatroom is requied',
        ref: 'User'
    },
    message: 
    {
        type: String,
        required:  'Message is required'
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);