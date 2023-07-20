const {room} = require('../services/room.services')

exports.createRoom = async (req,res) =>{
    const {player_id , player_limit , team_limit , lobby_difficulty} = req.body
    await room.createRoom(player_id , player_limit , team_limit , lobby_difficulty)  //socketId todo....
    res.status(200).json({
        message : "Room Created"
    })
}

exports.closeRoom = async (req,res) =>{
    const {room_id} = req.body
    await room.closeRoom(room_id)
    res.status(200).json({
        message : "Room Closed"
    })
}

exports.searchRoom = async (req,res) =>{
    const {player_id , lobby_difficulty} = req.body
    const rooms = await room.searchRoom(player_id , lobby_difficulty)
    res.status(200).json({
        rooms : rooms
    })
}

exports.joinRoom = async (req,res) =>{
    const {player_id , room_id} = req.body
    await room.joinRoom(player_id , room_id)
    res.status(200).json({
        message : "Player Joined"
    })
}

exports.leaveRoom = async (req,res) =>{
    const {player_id , room_id} = req.body
    await room.leaveRoom(player_id , room_id)
    res.status(200).json({
        message : "Player Left"
    })
}

