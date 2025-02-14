const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
        res.redirect('/login.html');
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(400).send('User not found');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        req.session.userId = user.id;
        res.redirect('/todos.html');
    });
});

module.exports = router;
