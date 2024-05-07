require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

const initPgsql = require('./config/pgsql');
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json({limit: '50mb'}));

app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(cors());

app.use('/uploads/active', express.static(path.join(__dirname, 'uploads/active')));
app.set('views', path.join(__dirname, 'views'));

module.exports = app;

require('./app/index').routerConfig(app);

Promise.all([require('./config/httpServer')()])
  .then((values) => {
    server.listen(app.get('port'), () => {
      console.log(
        `----------------------- Server listening on the port ${app.get(
          'port'
        )} ${new Date()} -----------------------`
      );

      initPgsql.getDBConnect().then(() => {
        console.log(`Pgsql Connected`);
      });
    });
  })
  .catch((error) => {
    console.log(
      `----------------------- Main server configuration error >> ${error} \n---------------------------------------------- `
    );
  });