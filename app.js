const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Pool } = require('pg')

const pool = new Pool({
    user: 'azis',
    host: 'localhost',
    database: 'datadb',
    password: 'azis',
    port: 5432,
})

const indexRouter = require('./routes/index')(pool);  //imediatly call function
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/bread', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
