const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
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

router.get('/logout', userController.logout);

// Exemple d'une route protégée
router.get('/index', authMiddleware, (req, res) => {
    // Traiter la demande pour le tableau de bord
    res.render('index');
});

module.exports = router;



