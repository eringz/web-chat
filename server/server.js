require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => {
        console.log(`Database Connected!`);
    })
    .catch((err) => {
        console.log(`Database Connection Error: ${err.message}`);
    });


//Invoke models
// require('./models/Chatroom');
// require('./models/Message');

const User = require('./models/User');
const Notification = require('./models/Notification');

const app = require('./app');

const server = app.listen(8888, () => {
    console.log('Running in localhost on port 8888');
});

const io = require('socket.io')(server,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    console.log(`Connected user ID: ${socket.id}`);

    socket.on('loginUser', (res) => {
        console.log(`Login User: ${res}`)

    });

    // socket.on('sendNotification', async (res) => {
    //     console.log(`receiver id: ${res.receiverId}`);
    //     console.log(`sender id: ${res.senderId}`);

    //     const receiverId = res.receiverId;
    //     const senderId = res.senderId;
    //     const message = 'sent you a friend request';

    //     const notification = await new Notification({
    //         receiverId,
    //         senderId,
    //         message
    //     })
        
    //     await notification.save();

    //     const notifications = await Notification.find({"receiverId": receiverId});

    //     console.log(notifications);
    //     socket.broadcast.emit('receiveNotification', notification);
        
    // });

    // socket.on('notifications', (res) => {
    //     socket.emit('receiveNotifications', res);

    // });

    // socket.on('logout_user', (res) => {
    //     console.log(`Logout User: ${res}`)
    // });

    socket.on('disconnect', (res) => {
        console.log(`Disconnected user ${socket.id}` )
    });
});
