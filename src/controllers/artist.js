const express = require('express');
const getDb = require('../services/db');

const artist = express.Router();

artist.post('/artist', async (req, res, next) => {
  const db = await getDb();
  const { name, genre } = req.body;

  try {
    await db.query('INSERT INTO  Artist (name, genre) VALUES (?, ?)', [
      name,
      genre,
    ]);

    res.status(201).json(req.body);
  } catch (err) {
    console.log(err);
    next(err);
  }

  db.close();
});

module.exports = artist;
