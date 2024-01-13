const { response } = require('express');
const authServiceClient = require('../../utils/authServiceClient');
const db = require('../../database/connection');
const fetch = require('node-fetch');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authServiceClient.register(username, password);
        res.redirect('/login');  // Rediriger vers une page de succès
    } catch (error) {
        res.status(500).send('Erreur lors de l\'inscription');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authServiceClient.login(username, password);
        res.cookie('jwt', result.message, { httpOnly: true });
        res.redirect('/dashboard'); // Rediriger vers une page de succès
    }
    catch (error) {
        res.status(500).send('Erreur lors de la connexion');
    }
};

exports.logout = async (req, res) => {
    try {
        // Récupérer le jeton du cookie
        const token = req.cookies.jwt;
        const result = await authServiceClient.logout(token);
        if (result.statut === "Succès"){
            res.clearCookie('jwt');
            res.redirect('/'); // Rediriger vers une page de succès
        }
    }
    catch (error) {
        res.status(500).send('Erreur lors de la déconnexion');
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.body;
        const result = await authServiceClient.verifyToken(token);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send('Erreur lors de la vérification du jeton');
    }
};


exports.displayStations = async (req, res, next) => {
    try {
        const apiUrlStationsInfo = 'https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_information.json';
        const apiUrlStationsStatus = 'https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_status.json';

        const responseInfo = await fetch(apiUrlStationsInfo);
        const stationsInfo = await responseInfo.json();

        const responseStatus = await fetch(apiUrlStationsStatus);
        const stationsStatus = await responseStatus.json();

        // Fusionner les données
        const stations = stationsInfo.data.stations.map(info => {
            const status = stationsStatus.data.stations.find(s => s.station_id === info.station_id);
            return { ...info, ...status };
        });

        res.locals.stations = stations;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors du traitement de la demande');
    }
};

exports.saveItinerary = async (req, res) => {
    try {
        const { itineraryName, startAddressSearch, endAddressSearch, 'data-lat-start': latStart, 'data-lon-start': lonStart, 'data-lat-end': latEnd, 'data-lon-end': lonEnd } = req.body;

        if (!itineraryName || !startAddressSearch || !endAddressSearch || !latStart || !lonStart || !latEnd || !lonEnd) {
            return res.status(400).json({ statut: "Erreur", message: "Données manquantes" });
        }

        const itinerary = {
            name: itineraryName,
            startAddress: startAddressSearch,
            endAddress: endAddressSearch,
            points: [
                { lat: latStart, lon: lonStart },
                { lat: latEnd, lon: lonEnd }
            ]
        };

        // Enregistrer l'itinéraire dans la base de données
        await db.query(
            'INSERT INTO itineraires (name, points, user_id) VALUES (?, ?, ?)',
            [itinerary.name, JSON.stringify(itinerary.points), req.user.user.user_id]
        );

        res.status(200).json({ statut: "Succès", message: "Ajout de l'itinéraire réussi." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statut: "Erreur", message: "Erreur lors de l'ajout de l'itinéraire." });
    }
};

exports.getItineraries = async (userId) => {
    try {
        const itineraire = await db.query(
            'SELECT * FROM itineraires WHERE user_id = ?',
            [userId]
        );

        return itineraire;
    } catch (error) {
        console.error(error);
        return [];
    }
};





