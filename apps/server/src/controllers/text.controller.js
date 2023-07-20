exports.getText = async (req, res) => {

    const difficulty = req?.query?.difficulty;


    switch (difficulty) {
        case 'easy':
            res.status(200).json({ message: 'Easy text' });
            break;
        case 'medium':
            res.status(200).json({ message: 'Medium text' });
            break;
        case 'hard':
            res.status(200).json({ message: 'Hard text' });
            break;
        default:
            res.status(200).json({ message: 'Random text' });
            break;
    }
}

exports.updatePlay = async (req, res) => {
    const { player_id, room_id, wpm } = req.body
    await played.updatePlay(player_id, room_id, wpm)
    res.status(200).json({
        message: "Play updated"
    })
}

