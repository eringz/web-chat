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
const ContactRequest = require('./models/ContactRequest');

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

    socket.on('sendContactRequest', async (res) => {
        const receiverId = res.receiverId;
        const senderId = res.senderId;
        const action = res.action;
        console.log('rec', receiverId);
        console.log('send', senderId);
        
        const contactRequestExists = await ContactRequest.findOne({
            "receiver": receiverId,
            "sender": senderId
        })


        if(contactRequestExists === null)
        {

            const contactRequest = await new ContactRequest({
                "receiver": receiverId,
                "sender": senderId
            });
            await contactRequest.save();
            await socket.emit('message', {contacRequestId: contactRequestExists.id, message: 'The contact request has been save.'});
        }
        else
        {
            console.log('Contact Request is already existed');
            socket.emit('message', {contacRequestId: contactRequestExists.id, message: 'Contact Request is already existed'})
        }
        
    });

    socket.on('', async (res) => {


        const notificationExist = await Notification.findOne({
            "contactRequest": contactRequestId
        });

        if(notificationExist)
        {
            await socket.emit('message', {message: 'Contact Request is already existed'}); 
        }
        else
        {
            const notification = new Notification({
                "message": action,
                "contactRequest": contactRequestId
            })
            
            notification.save();
            console.log('notif success');
        }

        const notificationRequestId = await notificationExist.id
    });

    


    socket.on('logoutUser', (res) => {
        console.log(`Logout User: ${res}`)
    });

    socket.on('disconnect', (res) => {
        console.log(`Disconnected user ${socket.id}` )
    });
});
