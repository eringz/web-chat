const mongoose = require('mongoose');


const contactRequestSchema = new mongoose.Schema({
    receiver:
    {
        type: String,
    },
    sender:
    {
        type: String,
    },
    isPending:
    {
        type: Boolean,
        default: true
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);