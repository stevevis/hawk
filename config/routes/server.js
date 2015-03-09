"use strict";

var _ = require("lodash");
var router = require("koa-router");
var Router = require("react-router");
var logger = require("../../config/logger");

// The client routes contains the React routes that we need on the server too
var routes = require("./client.js");

function requireController(name) {
  return require("../../controllers/" + name);
}

var secured = function *(next) {  
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.redirect("/");
  }
};

// Initialize a koa route for each master route
function generateKoaRoutes(app, parent, path) {
  var base = path ? path : "";
  var controller = requireController(parent.controller);

  var methods = ["get", "post", "put", "del"];
  
  _.each(methods, function(method) {
    if (controller[method]) {
      if (parent.secured) {
        app[method](base + parent.path, secured, controller[method]);
      } else {
        app[method](base + parent.path, controller[method]);
      }
    }
  });

  _.forEach(parent.children, function(route) {
    generateKoaRoutes(app, route, base + parent.path);
  });
}

// Initialize the Koa router
var initKoaRouter = function(app) {
  app.use(router(app));
  generateKoaRoutes(app, routes.source);
};

var initReactRouter = function(app) {
  app.use(function *(next) {
    Router.run(routes.react, this.request.path, function(Handler) {
      // Save a reference to the component in state so that the Koa controller render it and pass in any required state
      this.state.reactComponent = Handler;
    }.bind(this));

    return yield next;
  });
}

exports.init = function(app) {
  // The react router must come first because it determines which react component needs to be rendered and sets that 
  // component in context.state, then the koa router will determine which controller needs to be called so that it can 
  // load any data needed to render the react component.
  initReactRouter(app);
  initKoaRouter(app);
};
