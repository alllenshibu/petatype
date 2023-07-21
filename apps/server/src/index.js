const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { redis } = require('./config');

const soloRoutes = require('./routes/solo.routes');

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

app.use('/solo', require('./routes/solo.routes'));


io.on('connect', (socket) => {
    console.log('A user connected');

    // New Player
    socket.on('new-player', async () => {
        console.log({ playerId: socket.id, message: "New Player" });

        await redis.set(socket.id, JSON.stringify({
            wpm: 0,
            sessions: [{
                wpm: 0,
                accuracy: 0,
                time: 0
            }]
        }), 'EX', '60');

    })

    // Solo Finish
    socket.on('solo-finish', async (data) => {
        console.log({ playerId: socket.id, message: "Solo Finish", data });

        await redis.set(socket.id, JSON.stringify({
            wpm: data.wpm,
            accuracy: data.accuracy,
        }), 'EX', 3600)
    })


    // Create New Lobby
    socket.on('create-lobby', async (l) => {
        const lobbyId = l ? l : socket.id;
        console.log({ lobbyId, playerId: socket.id });

        await redis.set(lobbyId, "do something", 'EX', '60');
    })

    // Join Lobby
    socket.on('join-lobby', async (l) => {
        const lobbyId = l ? l : socket.id;
        console.log({ lobbyId, playerId: socket.id });

        await redis.get(lobbyId, (err, result) => {
            console.log(result);
        });
    })

    socket.on('close', async () => {
        console.log('user disconnected');
        redis.disconnect()
    })

});
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
