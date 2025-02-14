const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // 사용자 이름 중복 확인
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }
        if (results.length > 0) {
            // 사용자 이름이 이미 존재할 경우 처리
            return res.status(400).send('Username already exists. Please choose another one.');
        }

        // 새 사용자 추가
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server error');
            }
            res.redirect('/welcome.html');
        });
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

// 로그아웃 라우트 추가
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error during logout');
        }
        res.redirect('/login.html'); // 로그아웃 후 로그인 페이지로 리디렉션
    });
});

module.exports = router;
