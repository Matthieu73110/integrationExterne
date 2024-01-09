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
        if (userExists) {
            return res.status(409).json({ message: "L'utilisateur existe déjà." });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Enregistrez l'utilisateur dans la base de données
        await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        

        res.status(201).json({ message: 'Inscription réussie.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérifiez si l'utilisateur existe
        const user = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (!user) {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }

        // Comparez le mot de passe fourni avec le mot de passe haché stocké
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }

        // Créez un JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Connexion réussie.", token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
};


exports.logout = async (req, res) => {
    try {
        // Supprimez le JWT ou mettez à jour le statut de la session côté serveur si nécessaire

        res.json({ message: "Déconnexion réussie." });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
    }
};
