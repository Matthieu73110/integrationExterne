const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middlewares/authMiddleware');

// Générer un itinéraire au format PDF
router.post('/itinerary', authMiddleware.validateToken, pdfController.generatePdf);

// Télécharger un itinéraire
router.get('/itinerary', authMiddleware.validateToken, pdfController.downloadPdf);

module.exports = router;
