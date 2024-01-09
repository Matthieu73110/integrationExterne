const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/', (req, res) => {
    res.send('Bienvenue sur mon application Core Service!');
});

router.get('/login', (req, res) => {
    res.render('login');
}
);

router.get('/register', (req, res) => {
    res.render('register');
}
);

module.exports = router;



