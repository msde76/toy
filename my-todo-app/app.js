const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
