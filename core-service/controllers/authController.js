// Vous aurez besoin de communiquer avec le auth-service pour valider les identifiants
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
