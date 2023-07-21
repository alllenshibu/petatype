const soloServices = require('../services/solo.services');

exports.createSoloController = async (req, res) => {
        
        const {player_id, game_mode, difficulty} = req.body;
    
        try{
            console.log(player_id, game_mode, difficulty)
            const game_id = await soloServices.createSolo(player_id, game_mode, difficulty);
            res.status(200).json({game_id,   message:"Solo game created"});
        }
    
        catch(err){
            res.status(500).json({message:err.message});
        }
    }

exports.finishSoloController = async (req, res) => {
        
        const {player_id, game_id, wpm, accuracy} = req.body;
    
        try{
            await soloServices.finishSolo(player_id, game_id, wpm, accuracy);
            res.status(200).json({message:"Solo game finished"});
        }
    
        catch(err){
            res.status(500).json({message:err.message});
        }
    }

exports.abortSoloController = async (req, res) => {
       
        const {player_id, game_id} = req.body;

        try{
            await soloServices.abortSolo(player_id, game_id);
            res.status(200).json({message:"Solo game aborted"});
        }
        catch(err){
            res.status(500).json({message:err.message});
        }
    }

exports.getSoloHistoryController = async (req, res) => {

        const {player_id} = req.body;

        try{
            const history = await soloServices.getSoloHistory(player_id);
            res.status(200).json({history});
        }

        catch(err){
            res.status(500).json({message:err.message});
        }
    }

exports.getSoloGamesController = async (req, res) => {
          
            const {player_id} = req.body;
    
            try{
                const {history , games} = await soloServices.getSoloGames(player_id);
                res.status(200).json({history,games});
            }
    
            catch(err){
                res.status(500).json({message:err.message});
            }
        }



