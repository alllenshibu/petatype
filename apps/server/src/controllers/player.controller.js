const {service} = require('../services/player.services');

exports.createPlayer = async (req,res) =>{
    const {player_name , socket_id} = req.body
    await service.createPlayer(player_name , socket_id)
    res.status(200).json({
        message : "Player Created"
    })
}

exports.disconnectPlayer = async (req,res) =>{
    const {socket_id} = req.body
    await service.disconnectPlayer(socket_id)
    res.status(200).json({
        message : "Player Disconnected"
    })
}


