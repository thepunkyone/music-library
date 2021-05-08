/* eslint-disable no-unused-expressions */
const express = require('express');
const getDb = require('../services/db');

const artist = express.Router();

// At the moment these controller files contain both the controller and the route
// The controller logic (the callback that is passed to .get, .post, etc should be extracted
// into artistController and albumController respectively - see examples /controllers/artistController.js and /routes/artist.js
// Being able to treat routes and controllers as separate modules reduces unnecessary coupling of logic - the Single Responsibility Principle
// from SOLID principles.

artist
  .route('/artist')
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
  .route('/artist/:artistId')
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
        { affectedRows },
      ] = await db.query('UPDATE Artist SET ? WHERE id = ?', [data, artistId]);

      affectedRows ? res.sendStatus(200) : res.sendStatus(404);
    } catch (err) {
      console.log(err);
      next(err);
    }

    db.close();
  })
  .delete(async (req, res, next) => {
    const { artistId } = req.params;

    const db = await getDb();

    try {
      const [
        { affectedRows },
      ] = await db.query('DELETE from Artist WHERE id = ?', [artistId]);

      affectedRows ? res.sendStatus(200) : res.sendStatus(404);
    } catch (err) {
      console.log(err);
      next(err);
    }

    db.close();
  });

module.exports = artist;
