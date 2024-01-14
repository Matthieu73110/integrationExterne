const axios = require('axios');
const { param } = require('../routes/userRoutes');

const pdfServiceClient = {
    generatePdf: async (itineraireData, token) => {
        try {
            const response = await axios.post('http://127.0.0.1:3002/api/pdf/itinerary/', itineraireData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    downloadPdf: async (itineraryId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:3002/api/pdf/itinerary/download?id=${itineraryId}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

module.exports = pdfServiceClient;
