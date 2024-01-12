const axios = require('axios');

exports.validateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(400).json({ statut: "Erreur", message: "Jeton manquant" });
        }

        const response = await axios.post('http://127.0.0.1:3000/api/auth/verify', { token });

        if (response.data && response.data.statut === "Succès") {
            next();
        } else {
            return res.status(401).json({ statut: "Erreur", message: "Jeton inconnu" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ statut: "Erreur", message: "Erreur serveur" });
    }
};
