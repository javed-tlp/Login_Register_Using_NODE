const mysql = require('mysql2');

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_db',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = db;
