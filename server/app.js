const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


//Invoke routes
app.use('/user', require('./routes/user'))
app.use('/chatroom', require('./routes/chatroom'))

//Error Handler setup 
const errorHandlers = require('./handlers/errorHandler');
app.use(errorHandlers.catchErrors);
app.use(errorHandlers.mongooseErrors);
app.use(errorHandlers.notFound);

if(process.env.ENV === 'DEVELOPMENT')
{
    app.use(errorHandlers.developmentErrors);
}
else
{
    app.use(errorHandlers.productionErrors);
}
module.exports = app;