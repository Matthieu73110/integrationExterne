const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/', (req, res) => {
    res.send('Bienvenue sur mon application Core Service!');
});

module.exports = router;


module.exports = router;

