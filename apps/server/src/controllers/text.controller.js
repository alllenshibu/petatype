const { getTextByDifficulty } = require("../services/text.services");

exports.getText = async (req, res) => {

    let difficulty = req?.query?.difficulty;

    if (difficulty != 'easy' && difficulty != 'medium' && difficulty != 'hard')
        difficulty = 'easy'
    try {
        const text = await getTextByDifficulty(difficulty);
        res.status(200).json({ text });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}