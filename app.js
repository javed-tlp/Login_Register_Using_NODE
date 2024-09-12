// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const path = require('path');

const app = express();
const port = 3000;

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // For parsing application/json

// Configure session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
console.log(`Serving static files from: ${path.join(__dirname, 'public')}`);

// Use routes
app.use('/auth', authRoutes);  // Using '/auth' prefix for authentication routes
app.use('/profile', profileRoutes); // Assuming you have a profile route

console.log("Routes initialized");

// Serve the main index.html file
app.get('/', (req, res) => {
    console.log("GET request to / - Serving index.html");
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
