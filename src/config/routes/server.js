"use strict";

var _ = require("lodash");
var path = require("path");
var router = require("koa-router");
var Router = require("react-router");
var logger = require("../../config/logger");

// The client routes contains the React routes that we need on the server too
var routes = require("./client.js");

function requireController(name) {
  return require("../../controllers/" + name);
}

var toLowerCase = function(string) {
  return string.toLowerCase();
};

var secure = function *(next) {  
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.redirect("/");
  }
};

// Initialize a koa route for each master route
function generateKoaRoutes(app, route, parentPath) {
  var routePath = parentPath ? path.join(parentPath, route.path) : route.path;

  if (route.controller) {
    var controller = requireController(route.controller);

    _.each(_.map(route.methods, toLowerCase), function(method) {
      if (controller[method]) {
        if (route.secure) {
          app[method](routePath, secure, controller[method]);
        } else {
          app[method](routePath, controller[method]);
        }
      }
    });
  }

  _.forEach(route.children, function(childRoute) {
    generateKoaRoutes(app, childRoute, routePath);
  });
}

// Initialize the Koa router
var initKoaRouter = function(app) {
  app.use(router(app));
  generateKoaRoutes(app, routes.app);
  generateKoaRoutes(app, routes.action);
  generateKoaRoutes(app, routes.api);
};

var initReactRouter = function(app) {
  app.use(function *(next) {
    // We only render React components for GET requests to non API routes
    if (this.method !== "GET" || this.path.match(/^api/)) {
      return yield next;
    }

    Router.run(routes.react, this.request.path, function(Handler) {
      // Save a reference to the component in state so that the Koa controller render it and pass in any required state
      this.state.reactComponent = Handler;
    }.bind(this));

    yield next;
  });
};

exports.init = function(app) {
  // The react router must come first because it determines which react component needs to be rendered and sets that 
  // component in context.state, then the koa router will determine which controller needs to be called so that it can 
  // load any data needed to render the react component.
  initReactRouter(app);
  initKoaRouter(app);
};
