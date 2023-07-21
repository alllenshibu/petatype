
const {pool} = require('../config');

exports.createRoom = async (player_id ,room_name ,difficulty) =>{
            try{
                const room_id = await  pool.query("INSERT INTO game_room (host_id, room_name , difficulty) VALUES ($1, $2, $3) RETURNING room_code , room_id",
                 [player_id, room_name, difficulty]) 
                 console.log(room_id.rows[0] ,"is the room codeeeeee")
                await pool.query("INSERT INTO joined (player_id, room_id) VALUES ($1, $2)",
                    [player_id, room_id.rows[0].room_id])
                return room_id.rows[0].room_code
            }
            catch(err){
        console.log(err)
    }
}


exports.joinRoom = async (player_id , room_id) =>{
    try{
        await pool.query("BEGIN")
        const is_full = await pool.query("SELECT COUNT(*) FROM joined , game_room WHERE room_code = $1", [room_id])
        if(is_full.rows[0].count >= 7 || is_full.rows[0].count <=0){
            await pool.query("ROLLBACK")
            return false
        }
        const room_det = await pool.query("SELECT room_id FROM game_room WHERE room_code = $1", [room_id])
        await pool
        .query("INSERT INTO joined (player_id, room_id) VALUES ($1, $2)",
         [player_id, room_det.rows[0].room_id])

        await pool.query("COMMIT")
    }

    catch(err){
        console.log(err)
        throw err
    }
}

exports.disconnect= async(player_id) =>{

    try{

        const room_id = await pool.query("SELECT room_id FROM joined WHERE player_id = $1", [player_id])
        console.log(room_id.rows[0].room_id)
         await pool
        .query("DELETE FROM joined WHERE player_id = $1", [player_id])

        const room_code = await pool.query("SELECT room_code FROM game_room WHERE room_id = $1", [room_id.rows[0].room_id])
        console.log(room_code.rows[0].room_code)

        return room_code.rows[0].room_code ? room_code.rows[0].room_code : null
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
        .query("SELECT player_id , player_name FROM rooms, player WHERE room_id = $1", [room_id])
        return res.rows
    }

    catch(err){
        console.log(err)
        throw err
    }
}


