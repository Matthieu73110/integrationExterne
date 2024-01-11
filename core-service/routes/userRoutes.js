const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
}
);

router.get('/register', (req, res) => {
    res.render('register');
}
);

// Exemple d'une route protégée
router.get('/dashboard',authMiddleware, (req, res) => {
   let userName = req.user.identifiant;
    // Traiter la demande pour le tableau de bord
    res.render('dashboard', {userName});
}
);

// Redirection vers la page de connexion après la déconnexion
router.get('/logout', userController.logout, (req, res) => {
    res.redirect('/login');
}
);

router.get('/stations', userController.displayStations, (req, res) => {
    res.render('stations');
});
module.exports = router;



