const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, itineraryController.getItineraries);
router.post('/create', verifyToken, itineraryController.createItinerary);

module.exports = router;
