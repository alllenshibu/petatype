const {pool} = require('../config')

//todo ...all services should return error codes....

exports.insertPlay = async(player_id,room_id) => {

    try{
        await pool.query("INSERT INTO joined (player_id,room_id) VALUES($1,$2)",[
            player_id,room_id
        ])
    }

    catch(err){
        console.log(err)
    }
}

exports.updatePlay = async(player_id,room_id,wpm) => {

    try{
        await pool.query("UPDATE joined SET wpm = $1 WHERE player_id = $2 AND room_id = $3",[
            wpm,player_id,room_id
        ])
    }

    catch(err){
        console.log(err)
    }
}



