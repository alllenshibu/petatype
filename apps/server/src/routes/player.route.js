const router = require("express").Router();

const playerController = require('../controllers/player.controller');
router.post('/new', playerController.createPlayerController);

module.exports = router;
