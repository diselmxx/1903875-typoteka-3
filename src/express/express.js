"use strict";

const express = require(`express`);
const router = require(`./routes/router`);
const path = require(`path`);
const DEFAULT_PORT = 8080;

const session = require(`express-session`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const cors = require(`cors`);

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}


const StaticFolders = {
  PUBLIC_DIR: `public`,
  UPLOAD_DIR: `upload`,
};

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000,
});

const app = express();
app.use(cors());


sequelize.sync({force: false});

app.use(
    session({
      secret: SESSION_SECRET,
      store: mySessionStore,
      resave: false,
      proxy: true,
      saveUninitialized: false,
    })
);

app.use(express.urlencoded({extended: false}));


app.use(router);

app.use(express.static(path.resolve(__dirname, StaticFolders.PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, StaticFolders.UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates/layouts`));
app.set(`view engine`, `pug`);

app.use((error, req, res, next) => {
  if (error.response && error.response.status !== 404) {
    return res.status(error.response.status).render(`500`, {url: req.url});
  }
  res.status(404).render(`404`, {url: req.url});
  return next();
});

app.listen(DEFAULT_PORT);


