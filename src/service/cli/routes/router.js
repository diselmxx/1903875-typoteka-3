"use strict";

const { Router } = require(`express`);
const router = new Router();
const mainRoutes = require(`./main-routes`);

router.use(`/`, mainRoutes);

module.exports = router;
