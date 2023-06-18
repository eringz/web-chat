// const ContactRequest = require('../models/ContactRequest');
const User = require('../models/User');
const sha256 = require('js-sha256'); 

//Handling signup method
// exports.signup = upload.single('image'), async (req, res) => {
exports.signup = async (req, res) => {
    const {firstName, lastName, email, password, image} = req.body;
    // const url = req.protocol + '://' + req.get('host');

    // console.log('url', url);
    console.log(firstName);
    console.log(req.body);
    // let obj = {
    //     img: {
    //         data: fs.readFileSync(path.join('uploads/' + req.file.fileName)),
    //         contentType: 'image/png'
    //     }
    // }
    
    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com|@asg.com/;
    
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
        password: sha256(password + process.env.SALT),
        // img: obj
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
    const id = user.id;
    const firstName = user.firstName;
    const lastName = user.lastName;

    res.json({
        message: `User ${user.firstName} logged in successfully`,
        id,
        firstName,
        lastName,
        email
    })

}

//Handling a search function of an existing user for a contact request.
exports.search = async (req, res) => {
    const {email} = req.body;

    if(!email) throw `Email Address is required`;

    const user = await User.findOne({
        email
    });
    
    if(!user) throw `User not foundd`;
    const id = user.id;
    const firstName = user.firstName;
    const lastName = user.lastName;

    res.json({
        message: `User ${user.firstName} find`,
        id,
        firstName,
        lastName,
        email
    })
}

// Handling Contact request function to receiver user by a sender user and save.
exports.crequest =  async (req, res) => {
    const {receiverId, senderId} = req.body;

    console.log(receiverId);
    const contactRequestExists = await ContactRequest.find({
        "receiver": receiverId,
        "sender": senderId
    })

    if(contactRequestExists) throw `Contact Request is already exist.`

    const contactRequest = new ContactRequest({
        receiverId,
        senderId
    });


    await contactRequest.save();

    res.json({
        message: `Contact request has been process. Kindly wait for confirmation. Thank you.`
    });

}




