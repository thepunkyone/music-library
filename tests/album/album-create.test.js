/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../../src/services/db');
const app = require('../../src/app');

describe('create Album', () => {
  let db;
  beforeEach(async () => {
    db = await getDb();
    artist = await db.query('INSERT into Artist (name, genre) VALUES (?,?)', [
      'Tame Impala',
      'Rock',
    ]);
  });

  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.query('DELETE FROM Artist');
    await db.close();
  });

  describe('/artist/:artistId/album', () => {
    describe('POST', () => {
      it('creates a new album in the database', async () => {
        const res = await request(app).post('/artist/1/album').send({
          name: 'Currents',
          year: 2015,
        });

        expect(res.status).to.equal(201);

        const [[albumEntries]] = await db.query(
          'SELECT * FROM Album WHERE name = "Currents"'
        );

        expect(albumEntries.name).to.equal('Currents');
        expect(albumEntries.year).to.equal(2015);
        expect(albumEntries.artistId).to.equal(1);
      });
    });
  });
});
