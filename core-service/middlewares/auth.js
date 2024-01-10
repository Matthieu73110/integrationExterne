const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const jeton = req.cookies.jwt;

        if (!jeton) {
            return res.status(401).json({ statut: "Erreur", message: "Jeton manquant" });
        }

        const response = await verifierJeton(jeton);

        if (response.statut !== "Succès") {
            return res.status(401).json({ statut: "Erreur", message: "Jeton invalide" });
        }

        req.user = response.utilisateur; // Ajoute les informations de l'utilisateur à l'objet de requête
        next();
    } catch (error) {
        res.status(401).json({ statut: "Erreur", message: "Jeton invalide" });
    }
};


module.exports = authMiddleware;
