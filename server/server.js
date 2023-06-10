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

    
    socket.on('searchUser', async (data) => {
        const [searchEmail, senderId] = [data.email, data.senderId];
        
        const user = await User.findOne(
            {
                "email": searchEmail
            },
            {
                id: 1,
                firstName: 1,
                lastName: 1,
                email: 1
            }
        );

        if(user)
        {

            console.log(user);  
            socket.emit('searchedUser', {user: user,});
        }
        

    });

    // socket.on('searchContactRequest', async (data) => {
    //     console.log(data);
    //     const contactRequestPending = await ContactRequest.findOne({
    //         'recieverId': data.receiverId,
    //         'senderId': data.senderId
    //     },
    //     {
    //         isPending: 1
    //     });

    //     console.log(contactRequestPending);
    //     socket.emit('searchedContactRequest', {contactRequestPending: contactRequestPending})
    // });

    

    let start = new Date().getTime();
    /*
        * SERVER LISTEN TO EVENT 'sendContactRequest' FROM A CLIENT WITH DATA AND STORE IT IN CORRESPONDING VARIABLES
        * SETUP A CONDITION OF contactRequestExists.
        * SERVER EMITS AN EVENT CALLED message.
    */
    socket.on('sendContactRequest', async (data) => {
        const [receiverId, senderId, action] = [
            data.receiverId, data.senderId, data.action
        ];

        const contactRequestPending = await ContactRequest.findOne({
            'recieverId': data.receiverId,
            'senderId': data.senderId
        },
        {
            isPending: 1
        });

        console.log(contactRequestPending);
        const contactRequest = new ContactRequest({
            "receiver": receiverId,
            "sender": senderId,
        });

        contactRequest.save();

        const notification = new Notification({
            "message": action,
            "contactRequest": contactRequest.id
        })
        notification.save();
            
        socket.emit('contactRequestMessage', {message: 'You send a contact request'});
        
    });

    let end = new Date().getTime();
    let time = end - start;
    console.log(`time taken: ${time}ms`);

    socket.on('cancelContactRequest', async (res) => {
        const [receiverId, senderId] = [
            data.receiverId, data.senderId
        ];

        const contactRequestExists = await  ContactRequest.findOne({
            "receiver": receiverId,
            "sender": senderId
            },
            {
                _id: 1
            }
        )
        console.log(contactRequestExists);

    });

    


    socket.on('logoutUser', (res) => {
        console.log(`Logout User: ${res}`)
    });

    socket.on('disconnect', (res) => {
        console.log(`Disconnected user ${socket.id}` )
    });
});
