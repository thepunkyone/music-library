/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../../src/services/db');
const app = require('../../src/app');

describe('read artist', () => {
  let db;
  let artists;

  beforeEach(async () => {
    db = await getDb();
    await Promise.all([
      db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
        'Tame Impala',
        'rock',
      ]),
      db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
        'Kylie Minogue',
        'pop',
      ]),
      db.query('INSERT INTO Artist (name, genre) VALUES(?, ?)', [
        'Dave Brubeck',
        'jazz',
      ]),
    ]);

    [artists] = await db.query('SELECT * from Artist');

    await Promise.all([
      db.query('INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)', [
        'Currents',
        2015,
        artists.find((a) => a.name === 'Tame Impala').id,
      ]),
      db.query('INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)', [
        'Fever',
        2001,
        artists.find((a) => a.name === 'Kylie Minogue').id,
      ]),
      db.query('INSERT INTO Album (name, year, artistId) VALUES (?, ?, ?)', [
        'Time Out',
        1958,
        artists.find((a) => a.name === 'Dave Brubeck').id,
      ]),
    ]);

    [albums] = await db.query('SELECT * from Album');
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.query('DELETE FROM Artist');
    await db.close();
  });

  describe('/albums', () => {
    describe('GET', () => {
      it('returns all album records in the database', async () => {
        const res = await request(app).get('/albums').send();

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((albumRecord) => {
          const expected = albums.find((a) => a.id === albumRecord.id);

          expect(albumRecord).to.deep.equal(expected);
        });
      });
    });
  });
  describe('/artist/:artistId/album/:albumid', () => {
    describe('GET', () => {
      it('returns a single album with the correct id', async () => {
        const artistExpected = artists[0];
        const albumExpected = albums[0];
        const res = await request(app)
          .get(`/artist/${artistExpected.id}/album/${albumExpected.id}`)
          .send();

        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(albumExpected);
      });

      it('returns a 404 if the artist is not in the database', async () => {
        const res = await request(app).get('/artist/1/album/99999').send();

        expect(res.status).to.equal(404);
      });
    });
  });
});
