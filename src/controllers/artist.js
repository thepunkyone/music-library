const express = require('express');
const getDb = require('../services/db');

const artist = express.Router();

artist
  .route('/')
  .get(async (_, res, next) => {
    const db = await getDb();

    try {
      const [artists] = await db.query('SELECT * from Artist');
      res.status(200).send(artists);
    } catch (err) {
      console.log(err);
      next(err);
    }
    db.close();
  })
  .post(async (req, res, next) => {
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
