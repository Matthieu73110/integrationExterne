const jwt = require('jsonwebtoken');
const { verifyToken } = require('../../utils/authServiceClient');

const authMiddleware = async (req, res, next) => {
    try {
        const jeton = req.cookies.jwt; // Récupère le jeton dans le cookie

        if (!jeton) {
            return res.status(401).json({ statut: "Erreur", message: "Jeton manquant" });
        }

        const response = await verifyToken(jeton); // Vérifie le jeton

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
