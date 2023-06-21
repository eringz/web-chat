const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
    membersId: [],
    members: [],
    contents: []
},
{
    timestamps: true
});

module.exports = mongoose.model('Chatroom', chatroomSchema);