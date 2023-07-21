const router = require("express").Router();

const playerController = require('../controllers/player.controller');
router.get('/new', playerController.createPlayerController);

module.exports = router;
