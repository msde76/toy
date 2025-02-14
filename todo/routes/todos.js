const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login.html');
    }

    db.query('SELECT * FROM todos WHERE user_id = ?', [req.session.userId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }

        res.json(results);
    });
});

router.post('/', (req, res) => {
    const { task } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('Unauthorized');
    }

    db.query('INSERT INTO todos (user_id, task) VALUES (?, ?)', [userId, task], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
        res.redirect('/todos.html');
    });
});

router.post('/done', (req, res) => {
    const { taskId } = req.body;

    db.query('UPDATE todos SET is_done = 1 WHERE id = ?', [taskId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
        res.redirect('/todos.html');
    });
});

module.exports = router;
