require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var emailsRouter = require('./routes/emails');
var grupsRute = require('./routes/grups');
var cardGrupRoute = require('./routes/cardGrup');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    exposedHeaders: ["set-cookie"],
}));

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/grups', grupsRute);
app.use('/api/v1/cardgrup', cardGrupRoute);
app.use('/auth', emailsRouter);

module.exports = app;
