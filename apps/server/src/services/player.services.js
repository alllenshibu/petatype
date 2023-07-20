const pool = require('../config')

exports.createPlayer = async (player_name , socket_id) =>{

    try{
        await pool.query("INSERT INTO player_socket (player_name,socket_id) VALUES($1,$2)",[
            player_name,socket_id
        ])
    }

    catch(err){
        console.log(err)
    }
    
}

exports.disconnectPlayer = async (socket_id) =>{
    try{
        await pool.query("DELETE FROM player_socket WHERE socket_id = $1",[socket_id])
    }

    catch(err){
        console.log(err)
    }
}