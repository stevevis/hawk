"use strict";

var _ = require("lodash");
var router = require("koa-router");
var Router = require("react-router");

// The client routes contains the React routes that we need on the server too
var routes = require("./client.js");

function requireController(name) {
  return require("../../controllers/" + name);
}

// Convert the master routes list into Koa routes
function generateKoaRoutes(app, parent, path) {
  var base = path ? path : "";
  var controller = requireController(parent.controller);
  if (controller.get) {
    app.get(base + parent.path, controller.get);
  }

  _.forEach(parent.children, function(route) {
      generateKoaRoutes(app, route, base + parent.path);
  });
}

// Initialize the Koa router
routes.koaRouter = function(app) {
  app.use(router(app));
  generateKoaRoutes(app, routes.source);
};

// Initialize the server side React router
routes.reactRouter = function *(next) {
  Router.run(routes.react, this.request.path, function(Handler) {
    // Save a reference to the component in state so that the Koa controller render it and pass in any required state
    this.state.reactComponent = Handler;
  }.bind(this));

  return yield next;
};

module.exports = routes;
