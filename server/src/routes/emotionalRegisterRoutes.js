/**
 * Emotional Register Routes
 *
 * Define as rotas relacionadas a registros emocionais diários
 */

const express = require('express');
const EmotionalRegisterController = require('../controllers/emotionalRegisterController');

const router = express.Router();
const controller = new EmotionalRegisterController();

// GET /api/registers/:userId - Lista todos os registros do usuário
router.get('/registers/:userId', (req, res) => controller.getUserRegisters(req, res));

// GET /api/registers/:userId/month/:year/:month - Busca registros de um mês
router.get('/registers/:userId/month/:year/:month', (req, res) => controller.getRegistersByMonth(req, res));

// GET /api/registers/:userId/date/:date - Busca registro de uma data específica
router.get('/registers/:userId/date/:date', (req, res) => controller.getRegisterByDate(req, res));

// GET /api/registers/:userId/statistics/:year/:month - Estatísticas do mês
router.get('/registers/:userId/statistics/:year/:month', (req, res) => controller.getMonthStatistics(req, res));

// POST /api/registers - Cria ou atualiza um registro
router.post('/registers', (req, res) => controller.saveRegister(req, res));

// DELETE /api/registers/:userId/date/:date - Remove um registro
router.delete('/registers/:userId/date/:date', (req, res) => controller.deleteRegister(req, res));

module.exports = router;
