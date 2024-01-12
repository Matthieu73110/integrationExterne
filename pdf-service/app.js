const express = require('express');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

app.use(express.json());

app.use('/itinerary', pdfRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
