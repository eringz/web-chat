const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
    receiver:
    {
        type: String,
        // ref: 'User',
        // required: true
    },
    sender:
    {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        // required: true
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);