const express = require('express')
const router = express.Router()

router.get('/', require('../controllers/text.controller').getText)

module.exports = router