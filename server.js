"use strict";

// Dependencies
var koa = require("koa");
var path = require("path");
var koaViews = require("koa-views");
var staticCache = require("koa-static-cache");
var errorHandler = require("koa-error");
var requestLogger = require("koa-logger");
var livereload = require("koa-livereload");
var responseTime = require("koa-response-time");
require("node-jsx").install({extension: ".jsx"});

// Local dependencies
var logger = require("./config/logger");
var routes = require("./config/routes.jsx");

// Initialize the server
var app = module.exports = koa();
var port = process.env.PORT || 4000;

// Setup development middleware
if (app.env === "development") {
  app.use(livereload());
  app.use(requestLogger());
  app.use(staticCache(path.join(__dirname, "dist"), {
    gzip: true
  }));
}

// Setup middleware
app.use(responseTime());
app.use(errorHandler());
app.use(koaViews(path.join(__dirname, "dist/views"), {
  map: {
    html: "handlebars"
  }
}));

// Initialize the routers, the react router must come first because it determines which react component needs to be
// rendered and sets that component in context.state, then the koa router will determine which controller needs to
// be called so that it can load any data needed to render the react component.
app.use(routes.reactRouter);
routes.koaRouter(app);

// Start the server if this script wasn"t required by another script e.g. a function test script
if (!module.parent) {
  app.listen(port);
  logger.info("Server started, listening on port: " + port);
}
logger.info("Environment: " + app.env);
