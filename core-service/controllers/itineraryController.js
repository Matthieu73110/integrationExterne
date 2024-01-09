const db = require('../database/connection');

exports.getItineraries = async (req, res) => {
    try {
        // Logique pour récupérer les itinéraires de la base de données
        res.render('itineraries', { 
            itineraries: '/* itinéraires récupérés */' 
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createItinerary = async (req, res) => {
    try {
        // Logique pour créer un itinéraire
        res.redirect('/itinerary');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
