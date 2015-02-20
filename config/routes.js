"use strict";

var router = require("koa-router");
var IndexController = require("../controllers/IndexController.js");

module.exports = function(app) {
  app.use(router(app));
  app.get("/", IndexController.get);
};
