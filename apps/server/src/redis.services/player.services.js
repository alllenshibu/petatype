const {redis} = require('../config');

const {v4:uuidv4} = require('uuid');

exports.createPlayer = async (player_name , socket_id) =>{
    try{
        await redis.hset(`player:${uuidv4()}`,{
            player_name:player_name,
            current_room:null,
            current_game:null,
            is_host:false,
            is_ready:false,
            is_turn:false,
            is_playing:false,
            is_joined:false,
        })
    }

    catch(err){
        console.log(err)
    }
}

exports.getPlayers= async () => {
    try{
        const res = await redis.keys('player:*')
        console.log(res)
    }
    catch(err){
        console.log(err)
    }

}


exports.makeHost = async (player_id , room_id) =>{
    try{
        await redis.hset(`player:${player_id}`,{
            is_host:true,
            current_room:room_id,
        })
    }

    catch(err){
        console.log(err)
    }
}





