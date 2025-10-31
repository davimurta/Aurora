const express = require('express');
const ConnectionController = require('../controllers/connectionController');

const router = express.Router();
const connectionController = new ConnectionController();

router.post('/generate', (req, res) => connectionController.generateCode(req, res));

router.post('/connect', (req, res) => connectionController.connect(req, res));

router.get('/psychologist/:psychologistId/patients', (req, res) =>
  connectionController.listPatients(req, res)
);

router.get('/patient/:patientId/psychologist', (req, res) =>
  connectionController.getPsychologist(req, res)
);

router.get('/patient/:patientId/registers', (req, res) =>
  connectionController.getPatientRegisters(req, res)
);

module.exports = router;
