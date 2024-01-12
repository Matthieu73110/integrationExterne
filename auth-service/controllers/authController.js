const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/connection');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérifiez si l'utilisateur existe déjà
        const userExists = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        if (userExists.length > 0 ) {
            return res.status(409).json({ message: "L'utilisateur existe déjà." });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Enregistrez l'utilisateur dans la base de données
        await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        

        res.status(200).json({ statut: "Succès", message: "Ajout de l'utilisateur réussi." });
    } catch (error) {
        res.status(400).json({ statut:"Erreur", message: 'Erreur lors de l\'inscription.' });
    }
};

exports.login = async (req, res) => {
    try {

        const { username, password } = req.body;


        // Vérifiez si l'utilisateur existe déjà
        const result = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        const user = result[0];

        if (result.length === 0) {
            return res.status(401).json({ message: "L'utilisateur n'existe pas." });
        }

        // Vérifiez si le mot de passe est correct
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(401).json({ statut: "Erreur", message: 'Identifiants incorrects' });
        }

        // Créez un token JWT
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Stocker le jeton JWT dans la base de données
        await db.query(
            'UPDATE users SET token = ? WHERE user_id = ?',
            [token, user.user_id]
        );

        res.status(200).json({ statut: "Succès", message: token });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
    
};



exports.logout = async (req, res) => {
    try {

        console.log("Début de la déconnexion");
        console.log(req.query.token);

        // Récupérer le jeton
        const token = req.query.token;

        if (!token) {
            return res.status(400).json({ statut: "Erreur", message: "Jeton manquant" });
        }

        await supprimerJeton(token);

        res.status(200).json({ statut: "Succès", message: "Déconnexion réussie." });

    } catch (error) {
        res.status(500).json({ statut: "Erreur", message: 'Erreur lors de la déconnexion.' });
    }
};


const supprimerJeton = async (token) => {
    await db.query(
        'UPDATE users SET token = NULL WHERE token = ?',
        [token]
    );
};

exports.verifyToken = async (req, res) => {
    try {
        // Récupérer le jeton
        const jeton = req.body.token;

        if (!jeton) {
            return res.status(400).json({ statut: "Erreur", message: "JSON incorrect" });
        }

        // Vérifier le jeton
        let decoded;
        try {
            decoded = jwt.verify(jeton, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ statut: "Erreur", message: "Jeton inconnu" });
        }

        // Rechercher l'utilisateur associé au jeton
        const result = await db.query(
            'SELECT * FROM users WHERE token = ? and user_id = ?',
            [jeton, decoded.userId]
        );

        if (result.length === 0) {
            return res.status(401).json({ statut: "Erreur", message: "Jeton inconnu" });
        }

        const user = result[0];
        res.status(200).json({
            statut: "Succès",
            message: "Jeton valide",
            utilisateur: {user}
        });

    } catch (error) {
        res.status(500).json({ statut: "Erreur", message: "Erreur serveur" });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.query;
        const { identifiant } = req.body;

        if (!identifiant) {
            return res.status(400).json({ statut: "Erreur", message: "JSON incorrect" });
        }

        // Mise à jour de l'identifiant de l'utilisateur
        await db.query(
            'UPDATE users SET username = ? WHERE user_id = ?',
            [identifiant, id]
        );

        res.status(200).json({ statut: "Succès", message: "" });

    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ statut: "Erreur", message: "Erreur serveur" });
    }
};
