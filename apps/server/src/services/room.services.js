
const {pool} = require('../config');

exports.createRoom = async (player_id ,room_name , game_mode) =>{
            try{
                const room_id = pool.query("INSERT INTO rooms (host_id, room_name, current_game, game_mode, is_ready, is_playing, is_joined) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING room_id",
                 [player_id, socket_id, room_name, null, game_mode, false, false, false]) 
                return room_id;
            }
            
            catch(err){
        console.log(err)
    }
}


exports.joinRoom = async (player_id , room_id) =>{
    try{
        await pool.query("BEGIN")
        const is_full = await pool.query("SELECT COUNT(*) FROM joined WHERE room_id = $1", [room_id])
        if(is_full.rows[0].count >= 7 || is_full.rows[0].count <=0){
            await pool.query("ROLLBACK")
            return false
        }
        await pool
        .query("INSERT INTO joined (player_id, room_id) VALUES ($1, $2)",
         [player_id, room_id])

        await pool.query("COMMIT")
    }

    catch(err){
        console.log(err)
        throw err
    }
}

exports.disconnect= async(player_id) =>{

    try{
        await pool
        .query("DELETE FROM joined WHERE player_id = $1", [player_id])

    }
    catch(err){
        console.log(err)
        throw err   
    }

}

exports.getRooms= async (difficulty) => {
    try{
        const res = await pool
        .query("SELECT * FROM rooms WHERE difficulty = $1 and closed = $2 ORDER BY players DESC", [difficulty,false])
        return res.rows
    }
    catch(err){
        console.log(err)
        throw err
    }

}


exports.leaveRoom = async (player_id , room_id) =>{
    
    try{
        await pool
        .query("DELETE FROM joined WHERE player_id = $1 AND room_id = $2", [player_id, room_id])
    }

    catch(err){
        console.log(err)
        throw err
    }
}

exports.closeRoom = async (room_id) =>{
    try{
        await pool
        .query("UPDATE rooms SET closed = $1 WHERE room_id = $2", [true, room_id]) 
    }

    catch(err){
        console.log(err)
        throw err
    }
}

exports.openRoom = async (room_id) =>{

    try{
        await pool
        .query("UPDATE rooms SET closed = $1 WHERE room_id = $2", [false, room_id]) 
    }

    catch(err){
        console.log(err)
        throw err
    }
}

exports.getRoomDetails = async (room_id) =>{
    try{
        const res = await pool
        .query("SELECT player_id , player_name FROM rooms, WHERE room_id = $1", [room_id])
        return res.rows
    }

    catch(err){
        console.log(err)
        throw err
    }
}


