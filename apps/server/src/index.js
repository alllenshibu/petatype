const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { redis } = require('./config');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());

app.use('/text', require('./routes/text.route'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on('connect', (socket) => {
    console.log('A user connected');

    // New Player
    socket.on('new-player', async (data) => {
        console.log({ sockerId: socket.id, data });
        console.log('We have a new player');
        await redis.set(socket.id, data, 'EX', '10');
        await redis.disconnect()
    })


    // Create New Lobby
    socket.on('create-lobby', (data) => {
        console.log(data);
        console.log('We createing new lobby');
        socket.join(data.room_id);
        socket.to(data.room_id).emit('create-room', data);
    })

    // Join Lobby
    socket.on('join-lobby', (data) => {
        console.log(data);
        socket.join(data.room_id);
        socket.to(data.room_id).emit('join-room', data);
    })

});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
