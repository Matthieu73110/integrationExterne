const express = require('express');
const router = express.Router();
const authMiddleware = require('../src/middlewares/auth');
const userController = require('../src/controllers/userController');
const pdfServiceClient = require('../utils/pdfServiceClient');

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
router.get('/dashboard',authMiddleware, userController.displayStations,  async (req, res) => {
    var username = req.user.user.username
    var user_id = req.user.user.user_id
    // Récupérer les itinéraires de l'utilisateur depuis la base de données
    const myItinaries = await userController.getItinerariesByUserId(user_id);
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

// Route pour générer et télécharger le PDF
router.get('/download/:itineraryId', authMiddleware, async (req, res) => {
    try {
        const itineraryId = req.params.itineraryId;

        const token = req.cookies.jwt;

        const itineraryDetails = await userController.getItinerariesByItineraryId(itineraryId);

        // Assurez-vous que itineraryDetails est structuré correctement
        if (!itineraryDetails || itineraryDetails.length === 0) {
            return res.status(404).send("Itinéraire non trouvé");
        }

        // Préparer les données pour l'envoi
        const itineraire = itineraryDetails[0];
        const itineraireData = {
            itinerary: itineraire.itineraire_id,
            name: itineraire.name,
            points: JSON.parse(itineraire.points) // Parsez la chaîne JSON en objet
        };

        // Envoyer les données au service PDF
        pdfServiceClient.generatePdf(itineraireData, token);

        // recuperer les données du service PDF
        const pdfBase64 = await pdfServiceClient.downloadPdf(itineraryId);

        res.json({ statut: "Succès", message: "Téléchargement du PDF réussi", pdfBase64: pdfBase64 });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la génération du PDF");
    }
});

module.exports = router;



