const { createRoom } = require('../controllers/room.controller');

const lobbySocket = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "http://localhost:3000",
        }
      });


    io.on('connection', (socket) => {
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
        socket.on('create-lobby',(data,redirect)=>{
            const {playerId , lobbyName , lobbyId} = data

            //Add lobby to DB (Call controller)

            socket.join(lobbyId);

            const clients = io.sockets.adapter.rooms.get(lobbyId)
            console.log(clients)
            redirect(); //Redirects to lobby page
        })

        socket.on('update-lobby',(data)=>{
            const {lobbyId,playerId} = data
            console.log("Updating lobby")

            socket.join(lobbyId);

            const clients = io.sockets.adapter.rooms.get(lobbyId)
            console.log(clients)
        })

        socket.on('message',()=>{
            console.log("Disconnecting special msg")
        })

        socket.on('disconnect',(data)=>{
            console.log("Disconnected " + socket.id)

            socket.broadcast.emit('remove-player',socket.id)  //Poor performance need to store socket id and corresponsding room id to remove from that particular room
        })
    
        // Join Lobby
        socket.on('join-lobby', (data,redirect) => {
            const {playerId ,lobbyId} = data

            //Check if lobby exist in DB and add player to lobby in DB (Call controller)

            socket.join(lobbyId);
            const socketId = socket.id;
            socket.to(lobbyId).emit('add-player',{playerId:playerId,socketId:socketId})
            const clients = io.sockets.adapter.rooms.get(lobbyId)


            console.log("Joined Room");
            console.log("Room members: ")
            console.log(clients)
            redirect(); //Redirects to lobby page
        })
    
        socket.on('close', async () => {
            console.log('user disconnected');
            redis.disconnect()
        })
    
    });

}


module.exports = lobbySocket;

