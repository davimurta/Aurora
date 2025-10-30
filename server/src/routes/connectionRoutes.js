/**
 * Connection Routes
 *
 * Rotas para conexões entre psicólogos e pacientes
 */

const express = require('express');
const ConnectionController = require('../controllers/connectionController');

const router = express.Router();
const connectionController = new ConnectionController();

/**
 * POST /api/connections/generate
 * Psicólogo gera código de conexão
 */
router.post('/generate', (req, res) => connectionController.generateCode(req, res));

/**
 * POST /api/connections/connect
 * Paciente usa código para conectar
 */
router.post('/connect', (req, res) => connectionController.connect(req, res));

/**
 * GET /api/connections/psychologist/:psychologistId/patients
 * Lista pacientes conectados a um psicólogo
 */
router.get('/psychologist/:psychologistId/patients', (req, res) =>
  connectionController.listPatients(req, res)
);

/**
 * GET /api/connections/patient/:patientId/psychologist
 * Busca psicólogo conectado a um paciente
 */
router.get('/patient/:patientId/psychologist', (req, res) =>
  connectionController.getPsychologist(req, res)
);

/**
 * GET /api/connections/patient/:patientId/registers
 * Busca registros diários do paciente
 */
router.get('/patient/:patientId/registers', (req, res) =>
  connectionController.getPatientRegisters(req, res)
);

module.exports = router;
