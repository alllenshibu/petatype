const io = require('socket.io')(server);

io.on('connect', (socket) => {
    console.log('a user connected');
    socket.emit('test', 'hello from server')
});

const router = require("express").Router();

const playerController = require('../controllers/player.controller');
router.get('/new', playerController.createPlayerController);

module.exports = router;
