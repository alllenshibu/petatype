const {redis} = require('../config');

const {v4:uuidv4} = require('uuid');

exports.createRoom = async (player_id , room_name , socket_id , game_mode) =>{
    try{
        await redis.hset(`room:${uuidv4()}`,{
            host_id:player_id,
            socket_id:socket_id,
            room_name:room_name,
            current_game:null,
            game_mode:game_mode,
            is_ready:false,
            is_playing:false,
            is_joined:false,
        })
    }

    catch(err){
        console.log(err)
    }
}

exports.joinRoom = async (player_id , room_id , socket_id) =>{
    try{
        await redis.hset(`joined:${room_id}:${player_id}`,{
            socket_id:socket_id,
            is_joined:true,
            is_ready:false,
            wpm:0,
            accuracy:0,
            is_playing:false,

        })
    }

    catch(err){
        console.log(err)
    }
}
exports.changeHost = async (player_id , room_id) =>{
    try{
        await redis.hset(`room:${room_id}`,{
            host_id:player_id,
        })
    }

    catch(err){
        console.log(err)
    }
}

exports.leaveRoom = async (player_id , room_id) =>{
    try{
        
        await redis.del(`joined:${room_id}:${player_id}`)
    }
    catch(err){
        console.log(err)
    }
}

