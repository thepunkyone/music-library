const app = require('./src/app');

const APP_PORT = process.env.PORT || 4000;

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.listen(APP_PORT, () => {
  console.log(`App listening on localhost:${APP_PORT}`);
});
