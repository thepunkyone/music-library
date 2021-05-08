const getDb = require('../services/db');

// artist controller example with just the list method

const list = async (req, res, next) => {
  const db = await getDb();

  try {
    const [artists] = await db.query('SELECT * from Artist');
    res.status(200).send(artists);
  } catch (err) {
    console.log(err);
    next(err);
  }
  db.close();
};

module.exports = {
  list,
};
