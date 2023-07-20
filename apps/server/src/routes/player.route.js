const io = require('socket.io')(server);

io.on('connect', (socket) => {
    console.log('a user connected');
    socket.emit('test', 'hello from server')
});