const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();
const userController = new UserController();

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/logout', (req, res) => userController.logout(req, res));
router.post('/reset-password', (req, res) => userController.resetPassword(req, res));

router.get('/users/:id', (req, res) => userController.getUser(req, res));

router.get('/psychologists', (req, res) => userController.getPsychologists(req, res));
router.post('/psychologists/:id/approve', (req, res) =>
  userController.approvePsychologist(req, res),
);

module.exports = router;
