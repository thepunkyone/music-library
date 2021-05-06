const express = require('express');

const artistRoute = require('./controllers/artist');

const app = express();

app.use(express.json());

app.post('/artist', artistRoute);

module.exports = app;
