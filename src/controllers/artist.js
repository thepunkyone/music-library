/* eslint-disable no-unused-expressions */
const express = require('express');
const getDb = require('../services/db');

const artist = express.Router();

artist
  .route('/')
  .get(async (req, res, next) => {
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

artist
  .route('/:artistId')
  .get(async (req, res, next) => {
    const { artistId } = req.params;
    const db = await getDb();
    try {
      const [[result]] = await db.query('SELECT * from Artist WHERE id = ?', [
        artistId,
      ]);

      result ? res.status(200).send(result) : res.sendStatus(404);
    } catch (err) {
      console.log(err);
      next(err);
    }
    db.close();
  })
  .patch(async (req, res, next) => {
    const { artistId } = req.params;

    const data = req.body;

    const db = await getDb();

    try {
      const [
        { changedRows },
      ] = await db.query('UPDATE Artist SET ? WHERE id = ?', [data, artistId]);

      changedRows ? res.sendStatus(200) : res.sendStatus(404);
    } catch (err) {
      console.log(err);
      next(err);
    }

    db.close();
  });

module.exports = artist;
