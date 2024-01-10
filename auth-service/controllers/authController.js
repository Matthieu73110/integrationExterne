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
        

        res.status(201).json({ message: 'Inscription réussie.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
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

        console.log(user);

        if (user.length === 0) {
            return res.status(401).json({ message: "L'utilisateur n'existe pas." });
        }

        // Vérifiez si le mot de passe est correct
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Créez un token JWT
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ token });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
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
