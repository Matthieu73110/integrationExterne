const { response } = require('express');
const authServiceClient = require('../utils/authServiceClient');

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

exports.displayStation = async (req, res) => {
    try {
        let stationsFinal = [];
        let stationIds = [];
        const apiUrlStationsInformatins = 'https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_information.json';
        const apiUrlStationsStatus = 'https://velib-metropole-opendata.smovengo.cloud/opendata/Velib_Metropole/station_status.json';
        const response = await fetch(apiUrlStationsStatus);
        const data = await response.json();

        console.log(data);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send('Erreur lors de la vérification du jeton');
    }
};




