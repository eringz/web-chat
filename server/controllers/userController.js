const mongoose = require('mongoose');

const User = require('../models/User'); 
const sha256 = require('js-sha256'); 

//Handling signup method
exports.signup = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;
    
    if(!emailRegex.test(email)) throw `Email is invalid.`;
    if(password.length < 8) throw `Password must contain at least 8 characters long.`;

    const userExists = await User.findOne({
        email,
    })

    if(userExists) throw `Email address is already exist.`

    const user = new User({
        firstName, 
        lastName, 
        email, 
        password: sha256(password + process.env.SALT)
    });

    await user.save();

    res.json({
        message: `User [${firstName}] signed up successfully.`
    });
}

//Handling login method.
exports.login = async (req, res) => {
    const {email, password} = req.body;

    if(!email) throw `Email Address is required`;
    if(!password) throw `Password is required`;

    const user = await User.findOne({
        email,
        password: sha256(password + process.env.SALT)
    });
    
    if(!user) throw `Email and Password did not match`;
    const firstName = user.firstName;
    const lastName = user.lastName;

    res.json({
        message: `User ${user.firstName} logged in successfully`,
        firstName,
        lastName,
        email
    })

}

