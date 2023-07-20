const {played} = require('../services/joined.services')

exports.insertPlay = async (req,res) =>{
    const {player_id,room_id} = req.body
    await played.insertPlay(player_id,room_id)
    res.status(200).json({
        message : "Play inserted"
    })
}

exports.updatePlay = async (req,res) =>{
    const {player_id,room_id,wpm} = req.body
    await played.updatePlay(player_id,room_id,wpm)
    res.status(200).json({
        message : "Play updated"
    })
}




