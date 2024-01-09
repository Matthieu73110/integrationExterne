const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'mysql-matthieu-73.alwaysdata.net',
    user: '339794_aymeric',
    password: '339794_aymeric_projet_dev_auth',
    database: 'matthieu-73_integration_web'
});

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

module.exports = connection;
