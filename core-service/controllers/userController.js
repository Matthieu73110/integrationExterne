const authServiceClient = require('../utils/authServiceClient');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authServiceClient.register(username, password);
        res.redirect('/success');  // Rediriger vers une page de succès
    } catch (error) {
        res.status(500).send('Erreur lors de l\'inscription');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authServiceClient.login(username, password);
        // Stocker le token JWT ici si nécessaire
        res.redirect('/index');  // Rediriger vers le tableau de bord
    } catch (error) {
        res.status(500).send('Erreur lors de la connexion');
    }
};
