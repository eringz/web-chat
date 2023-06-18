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
const sha256 = require('js-sha256'); 

var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage })

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
    
    console.log('users before', onlineUsers);
    let start = new Date().getTime();
    count++
    console.log(`Connected user ID: ${socket.id} Count:${count}`);

    //NOTICE: SHOULD HAVE USER VALIDATION
    // socket.on('registerUser', async (data) => {
    //     const userExists = await User.findOne({
    //         email: data.email
    //     })

    //     if(userExists) throw `Email address is already exist.`

    //     const user = new User({
    //         firstName: data.firstName, 
    //         lastName: data.lastName, 
    //         email: data.email, 
    //         password: sha256(data.password + process.env.SALT)
    //     });

    //     await user.save();

    //     socket.emit('registeredUser', {user: user, message: `User "${user.firstName}" signed up successfully.`});
    // });


    //NOTICE: SHOULD HAVE USER VALIDATION
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

    socket.on('searchContacts', async (data) => {
        console.log('users now', onlineUsers);
        console.log('search contacts of ', data);
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
        console.log('user', user);
        
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

        console.log('User Target:', userTarget);

        io.to(userTarget).emit('notification', {user: null});
    });

    socket.on('getNotifications', async (data) => {
        console.log('get notification:',data);
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

    socket.on('cContactRequest', async (data) => {
        console.log('sfs',data);

        let j = 1;
        for(let i = 0; i<data.length; i++)
        {

            const user = await User.findOneAndUpdate(
            { "_id" : data[i]},
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

        console.log('notification latest:', users);
        socket.emit('confirmedContactRequest', users);

    });

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
