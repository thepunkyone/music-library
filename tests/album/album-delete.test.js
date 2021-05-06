/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../../src/services/db');
const app = require('../../src/app');

describe('delete album', () => {
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

  describe('/artist/:artistId/album/:albumId', () => {
    describe('DELETE', () => {
      it('deletes a single Album with the correct id', async () => {
        const artist = artists[0];
        const album = albums[0];
        const res = await request(app)
          .delete(`/artist/${artist.id}/album/${album.id}`)
          .send();

        expect(res.status).to.equal(200);

        const [
          [deletedAlbumRecord],
        ] = await db.query('SELECT * FROM Album WHERE id = ?', [album.id]);

        expect(!!deletedAlbumRecord).to.be.false;
      });

      it('returns a 404 if the album is not in the database', async () => {
        const res = await request(app).delete('/artist/1/album/999999').send();

        expect(res.status).to.equal(404);
      });
    });
  });
});
