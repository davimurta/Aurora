const express = require('express');
const EmotionalRegisterController = require('../controllers/emotionalRegisterController');

const router = express.Router();
const controller = new EmotionalRegisterController();

router.get('/registers/:userId', (req, res) => controller.getUserRegisters(req, res));

router.get('/registers/:userId/month/:year/:month', (req, res) => controller.getRegistersByMonth(req, res));

router.get('/registers/:userId/date/:date', (req, res) => controller.getRegisterByDate(req, res));

router.get('/registers/:userId/statistics/:year/:month', (req, res) => controller.getMonthStatistics(req, res));

router.post('/registers', (req, res) => controller.saveRegister(req, res));

router.delete('/registers/:userId/date/:date', (req, res) => controller.deleteRegister(req, res));

module.exports = router;
