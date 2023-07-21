const services = require('../services/player.services');

exports.createPlayerController = async (req, res) => {
    
    const {player_name} = req.body;

    try{
        const player_id = await services.createPlayer(player_name);
        res.status(200).json({message:"Player created" , player_id});
    }

    catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}

