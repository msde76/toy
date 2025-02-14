const express = require('express');
const db = require('../db');
const router = express.Router();

// 모든 To-Do 항목 가져오기
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

// 새 To-Do 항목 추가
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

// To-Do 항목 완료 처리
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

// To-Do 항목 삭제
router.post('/delete', (req, res) => {
    const { taskId } = req.body;

    db.query('DELETE FROM todos WHERE id = ?', [taskId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
        res.redirect('/todos.html');
    });
});

module.exports = router;
