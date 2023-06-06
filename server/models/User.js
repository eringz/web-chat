const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: 
    {
        type: String,
        required: 'First Name is required'
    },
    lastName:
    {
        type: String,
        required: 'Last Name is required'
    },
    email:
    {
        type: String,
        required: 'Email is required'
    },
    password:
    {
        type: String,
        required: 'Password is required'
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);