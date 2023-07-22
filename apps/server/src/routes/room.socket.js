const { createRoom } = require('../controllers/room.controller');

require('dotenv').config();

const roomServices = require('../services/room.services');
const playerServices = require('../services/player.services');

const lobbySocket = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: process.env.CLIENT_URL,
        }
      });


    io.on('connection', async (socket) => {
        console.log('A user connected');

        // New Player
        socket.on('new-user', async(playerId) => {
            console.log("New user ID",playerId,socket.id)
            socket.playerId = playerId;
            await playerServices.insertConnection(playerId,socket.id)
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
        socket.on('create-lobby',async (data,redirect)=>{
            const {playerId , lobbyName , difficulty} = data
            const socket_id = socket.id
            const lobbyId = await roomServices.createRoom(playerId,lobbyName ,difficulty)
            //Add lobby to DB (Call controller)
            console.log("Created Room ")
            console.log(lobbyId)

            socket.join(lobbyId);
 
            const clients = io.sockets.adapter.rooms.get(lobbyId)
            console.log(clients)
            redirect({lobbyId}); //Redirects to lobby page
        })

        socket.on('start-lobby',({lobbyId,text})=>{
            socket.broadcast.to(lobbyId).emit('start-game',{text:text})
        })

        socket.on('update-lobby',async(data)=>{
            const {lobbyId,playerId,playerData} = data

            if(playerData){
                // console.log(playerData);
                socket.broadcast.to(lobbyId).emit('update-players',playerData)
            }
            else{
                socket.join(lobbyId);
            }

            const clients = io.sockets.adapter.rooms.get(lobbyId)
            // console.log(clients)
        })

        socket.on('end-game',async(data)=>{
            
        })

        socket.on('add-players',async({playerId,lobbyId,socketId,playerName})=>{
            console.log("Oldplayer added to new joinee")
            socket.to(lobbyId).emit('add-player',{playerId:playerId,socketId:socketId,playerName:playerName})
        })

        socket.on('get-players',async(data,fn)=>{
            console.log("new players get player")
            const {lobbyId} = data
            const clients = io.sockets.adapter.rooms.get(lobbyId)
            const numClients = clients ? clients.size : 0;
            console.log("Player IDs of lobby")
            const players = []
            if(!clients){
                console.log("No clients")
                return;
            }
            for (const clientId of clients ) {
                const clientSocket = io.sockets.sockets.get(clientId);
                try{
                    players.push({name: clientSocket.playerId,playerId:clientSocket.playerId, wpm: 0, accuracy: 0, progress: 0, socketId: clientSocket.id })
                }
                catch(e){
                    console.log(e)
                }
           }
            console.log(players)
            fn(players)
        })

        socket.on('disconnecting',async(data)=>{
            console.log(socket.id)
               const res = await playerServices.disconnectPlayer(socket.id)
            console.log("Disconnecting Player Outside :  " + socket.playerId + " Socket ID is " + socket.id + " Res is :")
            console.log(res);
            if(socket.id !== undefined && socket.id !== null){
                console.log("Disconnecting Inside "  + socket.playerId)
                socket.broadcast.emit('remove-player',socket.id)  //Poor performance need to store socket id and corresponsding room id to remove from that particular room
            }
        })
    
        // Join Lobby
        socket.on('join-lobby', async(data,redirect) => {
            const {playerId ,lobbyId,playerName} = data


            await roomServices.joinRoom(playerId,lobbyId)
            //Check if lobby exist in DB and add player to lobby in DB (Call controller)

            socket.join(lobbyId);
            const socketId = socket.id;
            socket.to(lobbyId).emit('add-player',{playerId:playerId,socketId:socketId,playerName:playerName})
            const clients = io.sockets.adapter.rooms.get(lobbyId)

            console.log("Joined Room");
            console.log("Room members: ")
            console.log(clients)
            // redirect(); //Redirects to lobby page
        })


    
        socket.on('close', async () => {
            console.log('user disconnected');
            redis.disconnect()
        })
    
    });

}


module.exports = lobbySocket;

