const {redis} = require('../config');

const {v4:uuidv4} = require('uuid');

exports.createSolo = async (player_id , game_mode , difficulty) =>{
    try{
        
        const game_id = uuidv4()
        await redis.hset(`solo:${player_id}:${game_id}`,{
            player_id:player_id,
            game_mode:game_mode,
            is_playing:true,
            difficulty:difficulty,
        })
        return game_id
    }

    catch(err){
        console.log(err)
        throw err
    }
}

exports.finishSolo = async (player_id , game_id , wpm , accuracy) =>{
    try{

        const res = await redis.hgetall(`soloH:${player_id}`)
        if(res){
            const games_played = parseInt(res.games_played ? res.games_played:0)
            const avg_wpm = parseFloat(res.avg_wpm ? res.avg_wpm:0)
            const highest_wpm = parseFloat(res.highest_wpm ? res.highest_wpm:0)
            const highest_accuracy = parseFloat(res.highest_accuracy ? res.highest_accuracy:0)
            const [new_highest_wpm , wgame_id] = wpm > highest_wpm ? [wpm ,game_id]: [highest_wpm , res.wgame_id]
            const [new_highest_accuracy , agame_id] = accuracy > highest_accuracy ? [accuracy ,game_id]: [highest_accuracy , res.agame_id]
                await redis.hset(`soloH:${player_id}`,{
                    hightest_wpm:new_highest_wpm,
                    highest_accuracy:new_highest_accuracy,
                    wgame_id:wgame_id,
                    agame_id:agame_id,
                    avg_wpm:((avg_wpm*games_played)+wpm)/(games_played+1),
                    games_played:parseInt(games_played)+1,  
                })
        }
        else{
            await redis.hset(`soloH:${player_id}`,{
                hightest_wpm:wpm,
                highest_accuracy:accuracy,
                wgame_id:game_id,
                agame_id:game_id,
                avg_wpm:wpm,
                games_played:1,
            })
        }

        await redis.hset(`solo:${player_id}:${game_id}`,{
            is_playing:false,
            wpm:wpm,
            accuracy:accuracy,
        })
    }

    catch(err){

        console.log(err)
        throw err
    }
}

exports.abortSolo = async (player_id , game_id) =>{
    try{
        await redis.del(`solo:${player_id}:${game_id}`)
    }
    catch(err){
        console.log(err)
        throw err
    }
}

exports.getSoloHistory = async (player_id) =>{
    try{
        const history = await redis.hgetall(`soloH:${player_id}`)
        return history
    }
    catch(err){
        console.log(err)
        throw err
    }
}


exports.getSoloGames = async (player_id) =>{
    try{
        const history = await redis.hgetall(`soloH:${player_id}`)
        let games = []
        const game_id = await redis.keys(`solo:${player_id}:*`)
        console.log(game_id)
        for(let i=0;i< game_id.length;i++){
            const game = await redis.hgetall(game_id[i])
            console.log(game)
            games.push({id :game_id[i] , game})
        }
        return {history : history , games : games}
    }
    catch(err){
        console.log(err)
        throw err
    }
}

