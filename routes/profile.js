const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Display profile (only if logged in)
router.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.sendFile('/profile.html', { root: './views' });
    }

    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) throw err;

        const user = results[0];
        res.send(`Hello ${user.username}, this is your profile.`);
    });
});

module.exports = router;
