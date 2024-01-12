const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generatePdf = (req, res) => {
    const { itinerary, name, points } = req.body;

    if (!itinerary || !name || !points) {
        return res.status(400).json({ statut: "Erreur", message: "Données manquantes" });
    }

    // Créer un nouveau document PDF
    const doc = new PDFDocument();
    const pdfPath = `PDF-${itinerary}.pdf`;

    // Stream le contenu PDF dans un fichier
    doc.pipe(fs.createWriteStream(pdfPath));

    // Ajouter du contenu au PDF
    doc.fontSize(25).text(`Itinéraire: ${name}`, 100, 100);

    points.forEach((point, index) => {
        doc.fontSize(15).text(`Point ${index + 1}: ${point.lat}, ${point.lon}`, 100, 150 + index * 25);
    });

    // Finaliser le document PDF
    doc.end();

    // Répondre à la requête
    res.status(204).send();
};


exports.downloadPdf = (req, res) => {
    const itineraryId = req.query.id;

    if (!itineraryId) {
        return res.status(400).json({ statut: "Erreur", message: "ID d'itinéraire manquant" });
    }

    const pdfPath = path.resolve(`PDF-${itineraryId}.pdf`);

    if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ statut: "Erreur", message: "Itinéraire non trouvé" });
    }

    res.download(pdfPath);
};
