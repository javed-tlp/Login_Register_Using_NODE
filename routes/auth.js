// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const router = express.Router();
const db = require('../config/db'); // Adjust the path to your database configuration

// Display registration form
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});

// Handle registration
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Log the request body to verify data
    console.log('POST request to /auth/register - Data received:', req.body);

    // Check if username and password are provided
    if (!username || !password) {
        console.error('Username or password missing in the request');
        return res.status(400).send('Username and password are required.');
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Internal server error');
        }

        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting user into the database:', err);
                return res.status(500).send('Error registering the user.');
            }
            console.log('User registered successfully:', username);
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

    console.log('POST request to /auth/login - Data received:', req.body);

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            console.log('User not found:', username);
            return res.status(404).send('User not found!');
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('Internal server error');
            }

            if (isMatch) {
                req.session.userId = user.id;
                console.log('Login successful:', username);
                res.send('Login successful!');
            } else {
                console.log('Incorrect password for user:', username);
                res.status(401).send('Incorrect password!');
            }
        });
    });
});

module.exports = router;
