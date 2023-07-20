const express = require('express')
const router = express.Router()


// const fs = require("fs");
// fs.readFile("../server/data/words.csv", "utf-8", (err, data) => {
//     if (err) console.log(err);
//     else console.log(data);
// });


router.get('/', require('../controllers/text.controller').getText)

module.exports = router