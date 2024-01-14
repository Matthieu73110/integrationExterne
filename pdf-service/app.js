const express = require('express');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/pdf/', pdfRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
