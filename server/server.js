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
require('./models/User');
// require('./models/Chatroom');
// require('./models/Message');

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
    console.log(`Connected user ID: ${socket.id}`)
    socket.on('login_user', (res) => {
        console.log(`Login User: ${res}`)
    })

    socket.on('logout_user', (res) => {
        console.log(`Logout User: ${res}`)
    });

    socket.on('disconnect', (res) => {
        console.log(`Disconnected user ${socket.id}` )
    })
});
