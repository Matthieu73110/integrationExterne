const express = require('express');
const router = express.Router();
const authMiddleware = require('../src/middlewares/auth');
const userController = require('../src/controllers/userController');
const itineraireModel = require('../src/models/itineraireModel')

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
router.get('/dashboard',authMiddleware, userController.displayStations, async (req, res) => {
    var username = req.user.user.username
    var user_id = req.user.user.user_id
    var myItinaries = await itineraireModel.displayMyItinaries(user_id);
    console.log(myItinaries);
    // Traiter la demande pour le tableau de bord
    res.render('dashboard', {username, myItinaries});
}
);

// Redirection vers la page de connexion après la déconnexion
router.get('/logout', userController.logout, (req, res) => {
    res.redirect('/login');
}
);

// router.get('/stations', userController.displayStations, (req, res) => {
//     res.render('stations');
// });

router.get('/stations', userController.displayStations, (req, res) => {
    // Les données sont maintenant accessibles dans res.locals.stations
    res.render('stations', { stations: res.locals.stations });
});

router.get('/itineraire', authMiddleware, (req, res) => {
    res.render('itineraire');
});

// Route de sauvegarde d'un itinéraire
router.post('/itineraire', authMiddleware, userController.saveItinerary, (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router;



