const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generatePdf = (req, res) => {
    const { itinerary, name, points } = req.body;

    if (!itinerary || !name || !points) {
        return res.status(400).json({ statut: "Erreur", message: "Données manquantes" });
    }

    // Pas besoin de parser 'points', car il est déjà un tableau d'objets
    const doc = new PDFDocument();
    const pdfPath = `PDF/${itinerary}.pdf`;

    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(25).text(`Itinéraire: ${name}`, 100, 100);

    points.forEach((point, index) => {
        doc.fontSize(15).text(`Point ${index + 1}: ${point.lat}, ${point.lon}`, 100, 150 + index * 25);
    });

    doc.end();
    res.status(204).send();
};


exports.downloadPdf = (req, res) => {
    const itineraryId = req.query.id;

    if (!itineraryId) {
        return res.status(400).json({ statut: "Erreur", message: "ID d'itinéraire manquant" });
    }

    // Vérifiez si le fichier PDF existe
    const pdfPath = path.join(__dirname, `../PDF/${itineraryId}.pdf`);

    if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ statut: "Erreur", message: "Itinéraire non trouvé" });
    }

    fs.readFile(pdfPath, (err, pdfContent) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erreur lors de la lecture du fichier PDF");
        }

        const pdfBase64 = pdfContent.toString('base64');
        res.status(200).json({ statut: "Succès", message: "Téléchargement du PDF réussi", pdfBase64: pdfBase64 });
    });
};
