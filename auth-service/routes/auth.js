const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/verify', authController.verifyToken);
router.patch('/update', authController.updateUser);


module.exports = router;