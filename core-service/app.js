const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const userRoutes = require('./routes/userRoutes');
app.use(cookieParser());

// Configuration d'EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(userRoutes);

// Middleware pour les cookies
app.use(cookieParser());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Core Service running on port ${PORT}`));