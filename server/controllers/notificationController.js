const mongoose = require('mongoose');

const Notification = require('../models/Notification');
const User = require('../models/User');


exports.display = async (req, res) => {
    const receiverId = '6479972193bb3b5df3a837ca';

    // console.log('id', receiverId);

    const notifications = await Notification.find({"receiverId": receiverId})
    // if(!user) throw `User not foundd`;
    // const id = user.id;
    // const firstName = user.firstName;
    // const lastName = user.lastName;
    // console.log('notifications', notifications);


    res.json({
        message: `${notifications}`,
        notifications
    })
}
