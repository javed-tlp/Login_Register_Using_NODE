const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const router = express.Router();
const db = require('../config/db'); // Adjust path to db configuration

// Display registration form
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});

// Handle registration
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send(JSON.stringify({ error: 'Internal Server Error' }));
        }

        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).send(JSON.stringify({ error: 'Database Error' }));
            }
            res.send('User registered successfully!');
        });
    });
});

// Display login form
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Handle login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send(JSON.stringify({ error: 'Database Error' }));
        }

        if (results.length === 0) {
            return res.send('User not found!');
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send(JSON.stringify({ error: 'Internal Server Error' }));
            }

            if (isMatch) {
                req.session.userId = user.id;
                res.send('Login successful!');
            } else {
                res.send('Incorrect password!');
            }
        });
    });
});

module.exports = router;
