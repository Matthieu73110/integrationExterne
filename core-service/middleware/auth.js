const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt || '';

    if (!token) {
        return res.status(401).render('login', { message: "Veuillez vous connecter pour accéder à cette page." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).render('login', { message: "Session invalide, veuillez vous reconnecter." });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
