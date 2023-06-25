const User = require('../models/User');
const sha256 = require('js-sha256'); 
const path = require('path');
const fs = require('fs');

exports.signup = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com|@asg.com/;
    
    console.log('req body:', req.body);
    console.log('req file', req.file);
    console.log(path.join('C:/javascript-projects/chat/server/' + '/uploads/' + req.file.filename));
    if(!emailRegex.test(email)) throw `Email is invalid.`;
    if(password.length < 8) throw `Password must contain at least 8 characters long.`;

    const userExists = await User.findOne({
        email,
    })

    if(userExists) throw `Email address is already exist.`;


    const user = new User({
        firstName, 
        lastName, 
        email, 
        password: sha256(password + process.env.SALT),
        img: {
            data: fs.readFileSync('C:/javascript-projects/chat/server/'  + '/uploads/' + req.file.filename),
            contentType: 'image/*'
        }
    });

    await user.save();

    res.json({
        message: `User [${firstName}] signed up successfully.`
    });
}





