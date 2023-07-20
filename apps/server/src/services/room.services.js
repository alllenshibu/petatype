const {pool} = require('../config')

exports.createRoom = async (player_id , player_limit , team_limit , lobby_difficulty) =>{
    // socket id should be obtained from a socket service .. todo
    try{
        await pool.query("INSERT  INTO game_room (party_leader,socket_id,player_limit,team_limit , lobby_difficulty) VALUES($1, $2 , $3 , $4)",[
            player_id,socket_id,player_limit,team_limit,lobby_difficulty
        ])
    }

    catch(err){
        console.log(err)
    }
    

}

exports.closeRoom = async (room_id) =>{
    try{
        await pool.query("UPDATE game_room SET is_open = false WHERE room_id = $1",[room_id])
    }

    catch(err){
        console.log(err)
    }
}

exports.searchRoom = async (player_id , lobby_difficulty) =>{
    try{
        const res = await pool.query("SELECT * FROM game_room WHERE is_open = true AND lobby_difficulty = $1",[lobby_difficulty])
        return res.rows
    }

    catch(err){
        console.log(err)
    }
}

exports.joinRoom = async (player_id , room_id) =>{
    try{
        await pool.query("INSERT INTO joined (player_id,room_id) VALUES($1,$2)",[
            player_id,room_id
        ])
    }

    catch(err){
        console.log(err)
    }
}

exports.leaveRoom = async (player_id , room_id) =>{
    
    try {

        await pool.query("DELETE FROM joined WHERE player_id = $1 AND room_id = $2",[
            player_id,room_id
        ])
    }

    catch(err){
        console.log(err)
    }
}

