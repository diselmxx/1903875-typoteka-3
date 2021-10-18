"use strict";

const express = require(`express`);
const router = require(`./routes/router`);
const path = require(`path`);
const PUBLIC_DIR = `public`;
const DEFAULT_PORT = 8080;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(router);

app.set(`views`, path.resolve(__dirname, `templates/layouts`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT);
