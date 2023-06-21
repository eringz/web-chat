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


const app = require('./app');
const User = require('./models/User');
const Chatroom = require('./models/Chatroom');
const sha256 = require('js-sha256'); 

const server = app.listen(8888, () => {
    console.log('Running in localhost on port 8888');
});

const io = require('socket.io')(server,{
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

let count = 0;
var onlineUsers = [];
var userTarget;
io.on('connection', (socket) => {
    
    let start = new Date().getTime();
    count++
    console.log(`Connected user ID: ${socket.id} Count:${count}`);

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'loginUser' WITH EMAIL AND PASSWORD DATA TO FIND A EXISTING USER. 
        * SERVER EMITS TO CLIENT WITH AN EVENT CALLED 'logUser' WITH SORED USER AND MESSAGE OBJECT PASS TO CLIENT SIDE.
        * DEVELOPER: RON SANTOS
    */
    socket.on('loginUser', async (data) => {
        const user = await User.findOne(
            {
                email: data.email,
                password: sha256(data.password + process.env.SALT)
            },
            {
                id:1,
                firstName: 1,
                lastName: 1,
                email: 1
            }
            );
            
        if(user)
        {
            onlineUsers.push({socketId: socket.id, userId: user.id});
            console.log(`this socket id: ${socket.id} ${user.firstName}`);
            socket.emit('logUser', {user: user, message: `User ${user.firstName} logged in successfully`});
            
            for(let i = 0; i<onlineUsers.length; i++)
            {
                console.log('socket', onlineUsers[i].socketId);
            }
        }
       
        console.log('users now', onlineUsers);
    });

    /*
        * SERVER LISTEN TO AN EVENT CALLED  'searchUser' WHICH INVOKE AN USER ID AS PARAMETER
        * INVOKE USERS DATA FROM DATABASE USING ID
        * DEVELOPER: RON SANTOS
    */
    socket.on('searchUser', async (data) => {
        const user = await User.findOne(
            { 
                _id: data 
            },
            {
                id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                contacts: 1,
                contactRequests: 1,
                notifications: 1
            }
        );
        
        socket.emit('user', {user: user});

    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'searchContacts' BY DATA ID TO DETERMINE THE EXISTING CONTACTS PER USER
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'contacts' WITH AN OBJECT OF CONTACTS OF USER TO CLIENT
        * DEVELOPER: RON SANTOS
    */
    socket.on('searchContacts', async (data) => {

        const users = [];
        const user = await User.findOne(
            { 
                _id: data
            },
            {
                contacts: 1,
            }
        ); 
        
        const contacts = user.contacts;
        
        for(let i = 0; i < contacts.length; i++)
        {
            users.push(
                await User.findOne(
                    {
                        _id: user.contacts[i]
                    },
                    {
                        id: 1,
                        firstName: 1,
                        lastName: 1,
                    }
                )
            );
        }
        
        socket.emit('contacts', users);

    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'searchUserByEmail' BY SEARCH EMAIL TO IDENTIFY THE SEARCH USER INFORMATIONS.
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'searcedhUserByEmail' WITH AN USER INFORMATIONS SEARCH BY USING AN EMAIL.
        * DEVELOPER: RON SANTOS
    */
    socket.on('searchUserByEmail', async (data) => {
        const [searchEmail, senderId] = [data.email, data.senderId];
        const user = await User.findOne(
            {
                "email": searchEmail
            },
            {
                id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                contacts: 1,
                contactRequests: 1,
                notifications: 1
            }
        );

        socket.emit('searcedhUserByEmail', {user: user}); 
    });

    /*
        * SERVER LISTEN TO EVENT 'sendContactRequest' FROM A CLIENT WITH DATA AND STORE IT IN CORRESPONDING VARIABLES
        * SETUP A CONDITION OF contactRequestExists.
        * SERVER EMITS AN EVENT CALLED message.
    */
    socket.on('sendContactRequest', async (data) => {
        const [receiverId, senderId, action] = [
            data.receiverId, data.senderId, data.action
        ];

        const date = new Date();

        const contactRequest = await User.findOneAndUpdate(
            { "_id" : receiverId },
            {  
                $push: {contactRequests : senderId},
            }
        );

        contactRequest.save();

        const user = await User.findOne({"_id": senderId});


        for(let i = 0; i < onlineUsers.length; i++)
        {
            if(onlineUsers[i].userId === receiverId )
            {
                userTarget = onlineUsers[i].socketId;
            }
        }

        
        console.log('User Target:', userTarget);

        io.to(userTarget).emit('notification', {user: user});

    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'cancelContactRequest' BY RECEIVER AND SENDER ID PARAMATERS TO CANCEL AN EXISTING REQUEST.
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'notification' WITH A CANCELLED REQUEST.
        * DEVELOPER: RON SANTOS
    */
    socket.on('cancelContactRequest', async (data) => {
        const [receiverId, senderId] = [
            data.receiverId, data.senderId
        ];

        const user = await User.updateOne(
            { "_id" : receiverId },
            {$pull: {contactRequests: senderId}}
        );

        for(let i = 0; i < onlineUsers.length; i++)
        {
            if(onlineUsers[i].userId === receiverId )
            {
                userTarget = onlineUsers[i].socketId;
            }
        }

        io.to(userTarget).emit('notification', {user: null});
    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'getNotifications' TO GET NOTIFICATION .
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'notifications'.
        * DEVELOPER: RON SANTOS
    */
    socket.on('getNotifications', async (data) => {
        let users = [];  
        const user = await User.findOne(
            { 
                _id: data 
            },
            {
                id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                contacts: 1,
                contactRequests: 1,
                notifications: 1
            }
        );
        
        for(let i = 0; i < user.contactRequests.length; i++)
        {
           users.push(await User.findOne({
            "_id": user.contactRequests[i]
            },{
                id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
            }));
        }

        console.log('users', users);

        socket.emit('notifications', users );
    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'cContactRequest' FOR CONFIRM CONTACT REQUEST .
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'confirmedContactRequest'.
        * DEVELOPER: RON SANTOS
    */
    socket.on('cContactRequest', async (data) => {
        
        let j = 1;
        for(let i = 0; i<data.length; i++)
        {

            const user = await User.findOneAndUpdate(
                { 
                    "_id" : data[i]
                },
                {  
                    $push: {contacts : data[j]},
                    $pull: {contactRequests : data[j]}
                }
            );
            j--
            
        }

        const users = [];      
        const user = await User.findOne(
            { 
                _id: data 
            },
            {
                id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                contacts: 1,
                contactRequests: 1,
                notifications: 1
            }
        );
        
        for(let i = 0; i<user.contactRequests.length; i++)
        {
           users.push(await User.findOne({
            _id: user.contactRequests[i]
            },{
                id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
            }));
        }
        socket.emit('confirmedContactRequest', users);

    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'cContactRequest' FOR CONFIRM CONTACT REQUEST .
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'confirmedContactRequest'.
        * DEVELOPER: RON SANTOS
    */
    socket.on('rejectContactRequest', async (data) => {
        console.log('sfs',data);
        
        let j = 1;
        for(let i = 0; i<data.length; i++)
        {

            const user = await User.findOneAndUpdate(
            { "_id" : data[i]},
                {  
                    $pull: {contactRequests : data[j]}
                }
            );
            j--
            
        }

        const users = [];      
        const user = await User.findOne(
            { 
                _id: data 
            },
            {
                id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                contacts: 1,
                contactRequests: 1,
                notifications: 1
            }
        );
        
        for(let i = 0; i<user.contactRequests.length; i++)
        {
           users.push(await User.findOne({
            _id: user.contactRequests[i]
            },{
                id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
            }));
        }

        socket.emit('rejectedContactRequests', users);
    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'createRoom' FOR FINDING CHATROOM OR CREATING IF NO EXISTING CHATROOMS FOR USERS .
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'joinUser'.
        * DEVELOPER: RON SANTOS
    */
    let room = 1;
    socket.on('createRoom', async (data) => {
        
        const user0 = await User.findOne(
            {
                "_id": data[0]
            },
            {
                id: 1,
                firstName: 1,
                lastName: 1
            }
        )

        const user1 = await User.findOne(
            {
                "_id": data[1]
            },
            {
                id: 1,
                firstName: 1,
                lastName: 1
            }
        )

        const privateChatrooms0 = await Chatroom.findOne({"membersId": data});
        const privateChatrooms1 = await Chatroom.findOne({"membersId": [data[1], data[0]]});

        let privateChatroom;
        if(privateChatrooms0 === null && privateChatrooms1 === null)
        {
            const privateChatRoom = new Chatroom({
                membersId: data,
                members: [user0.firstName + " " + user0.lastName, user1.firstName + " " + user1.lastName ]
            });
    
            privateChatRoom.save();
        }
        else if(privateChatrooms0 !== null)
        {
            socket.join(privateChatrooms0._id)
            privateChatroom = privateChatrooms0;
        }
        else if(privateChatrooms1 !== null)
        {
            socket.join(privateChatrooms1._id)
            privateChatroom = privateChatrooms1
        }

        socket.emit('joinUser', {privateChatroom: privateChatroom })
        
    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'getPrivateChatrooms' TO GET PRIVATE CHAT ROOMS.
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'privateChatroomLists' STORED.
        * DEVELOPER: RON SANTOS
    */
    socket.on('getPrivateChatrooms', async (data) => {
        console.log('user', data);
        const privateChatrooms = await Chatroom.find({membersId: data});
        socket.emit('privateChatroomLists', privateChatrooms);
    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'joinRoom' TO JOIN IN AN EXISTING PRIVATE CHATROOM.
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'joinUser' STORED.
        * DEVELOPER: RON SANTOS
    */
    socket.on('joinRoom', async (data) => {
        const privateChatroom = await Chatroom.findOne({"_id": data});
        socket.join(data);
        socket.emit('joinUser', {privateChatroom: privateChatroom })
    });

    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'sendMessage' TO SEND A MESSAGE.
        * SERVER EMIT TO CLIENT WITH AN EVENT CALLED 'receiveMessage' TO A SPECIFIC RECEIPIENT.
        * DEVELOPER: RON SANTOS
    */
    socket.on('sendMessage', async (data) => {
        const newMessage = await Chatroom.findOneAndUpdate(
            {
                "_id" : data.room
            },
            {
                $push: 
                {
                    contents : 
                    {
                        authorId: data.authorId, 
                        author: data.author, 
                        message: data.message, 
                        time: data.time
                    }
                },
            }
        )

        for(let i = 0; i < onlineUsers.length; i++)
        {
            if(onlineUsers[i].userId === data.receipientId )
            {
                userTarget = onlineUsers[i].socketId;
            }
        }

        io.to(userTarget).emit('', newMessage);
 

    });
    
    /**
        * SERVER LISTEN TO CLIENT WITH AN EVENT CALLED 'logoutUser' TO LOGOUT A USER.
        * DEVELOPER: RON SANTOS
    */
    socket.on('logoutUser', (data) => {
        console.log(`Logout User: ${data}`)
        let temp = [];
        for(let i = 0; i < onlineUsers.length; i++)
        {
            if(onlineUsers[i].userId !== data)
            {
                temp.push(onlineUsers[i]);
            }
        }
        onlineUsers = temp;
        console.log('still online',onlineUsers);
    });

    socket.on('disconnect', (data) => {
        count--;
        console.log(`Disconnected user ${socket.id} Count: ${count} data: ${data}` )

    });

    let end = new Date().getTime();
    let time = end - start;
    console.log(`time taken: ${time}ms`);
    console.log('all users:', onlineUsers);
    
});
