const express = require('express');
const app = express();
const path = require('path');
const itineraryRoutes = require('./routes/itinerary');

// Configuration d'EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/itinerary', itineraryRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Core Service running on port ${PORT}`));