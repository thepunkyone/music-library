const express = require('express');

const artist = express.Router();

const artistController = require('../controllers/artistController');

// artist route example with just the GET

artist
  .route('/artist')
  .get(artistController.list);

module.exports = artist;
