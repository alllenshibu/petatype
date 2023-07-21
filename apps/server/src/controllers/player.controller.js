const services = require('../redis.services/player.services');

exports.createPlayerController = async (req, res) => {
    
    const {player_name, socket_id} = req.body;

    try{
        await services.createPlayer(player_name, socket_id);
        res.status(200).json({message:"Player created"});
    }

    catch(err){
        res.status(500).json({message:err.message});
    }
}

