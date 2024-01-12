const { response } = require('express');
const authServiceClient = require('../../utils/authServiceClient');
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


exports.saveItinerary = (req, res) => {

    // [Object: null prototype] {
    //     itineraryName: 'AA',
    //     startAddressSearch: '44 Rue Mademoiselle 75015 Paris',
    //     endAddressSearch: '15 Rue Jules Chaplain 75006 Paris',
    //     'data-lat-start': '48.84354144350769',
    //     'data-lon-start': '2.2990608215332036',
    //     'data-lat-end': '48.84252467301336',
    //     'data-lon-end': '2.3304748535156254',
    //     saveitin: "Enregistrer l'itinéraire"
    //   }

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
        const itineraire = await db.query(
            'INSERT INTO itineraries (name, points, user_id) VALUES (?, ?, ?, ?)',
            [itinerary.name, JSON.stringify(itinerary.points), req.user.user_id]
        );

        res.status(204).send();
    } catch (error) {

    

}





