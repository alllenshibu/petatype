const soloController = require('../controllers/solo.controller');
const router = require('express').Router();

router.post('/create', soloController.createSoloController);
router.post('/finish', soloController.finishSoloController);
router.post('/abort', soloController.abortSoloController);
router.post('/history', soloController.getSoloHistoryController);
router.post('/games', soloController.getSoloGamesController);


module.exports = router;
