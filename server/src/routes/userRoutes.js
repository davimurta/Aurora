/**
 * User Routes
 *
 * Define as rotas relacionadas a usuários e autenticação.
 */

const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();
const userController = new UserController();

// Rotas de autenticação
router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/logout', (req, res) => userController.logout(req, res));
router.post('/reset-password', (req, res) => userController.resetPassword(req, res));

// Rotas de usuários
router.get('/users/:id', (req, res) => userController.getUser(req, res));

// Rotas de psicólogos
router.get('/psychologists', (req, res) => userController.getPsychologists(req, res));
router.post('/psychologists/:id/approve', (req, res) =>
  userController.approvePsychologist(req, res),
);

module.exports = router;
