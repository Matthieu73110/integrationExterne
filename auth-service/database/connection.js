const mysql = require('mysql');
require('dotenv').config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

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
