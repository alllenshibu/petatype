const EASY = '../server/data/easy.csv';
const MEDIUM = '../server/data/medium.csv';
const HARD = '../server/data/hard.csv';

const TEXT_LENGTH = 40;


const fs = require("fs");

const csvParser = require("csv-parser");

exports.getTextByDifficulty = async (difficulty) => {
    try {
        const selectedData = await new Promise((resolve, reject) => {
            const rows = [];
            fs.createReadStream(
                difficulty === 'easy' ? EASY : difficulty === 'medium' ? MEDIUM : HARD
            )
                .pipe(csvParser({ headers: true }))
                .on('data', (row) => rows.push(row))
                .on('end', () => resolve(rows))
                .on('error', (error) => reject(error));
        });

        const shuffledData = selectedData.sort(() => Math.random() - 0.5);

        const selectedRows = shuffledData.slice(0, TEXT_LENGTH);
        const text = selectedRows.map((row) => row['_0']).join(' ');
        return text
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
}