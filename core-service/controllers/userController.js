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
        res.redirect('/index'); // Rediriger vers une page de succès
    }
    catch (error) {
        res.status(500).send('Erreur lors de la connexion');
    }
};

exports.logout = async (req, res) => {
    try {
        const result = await authServiceClient.logout();
        res.clearCookie('jwt');
        res.redirect('/login'); // Rediriger vers une page de succès
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





