"use strict";

var _ = require("lodash");
var path = require("path");
var koaRouter = require("koa-router");
var ReactRouter = require("react-router");
var logger = require("../../config/logger");

// The client routes contains the React routes that we need on the server too
var routes = require("./client.js");

function requireController(name) {
  return require("../../controllers/" + name);
}

var toLowerCase = function(string) {
  return string.toLowerCase();
};

/*
 * TODO: Something better for API routes, like return 401 Unauthorized...
 */
var secure = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    logger.warn("User is not authorized for this route");
    this.redirect("/");
  }
};

// Initialize a koa route for each master route
function generateKoaRoutes(router, route, parentPath) {
  var routePath = parentPath ? path.join(parentPath, route.path) : route.path;

  if (route.controller) {
    var controller = requireController(route.controller);

    _.each(_.map(route.methods, toLowerCase), function(method) {
      if (controller[method]) {
        if (route.secure) {
          router[method](routePath, secure, controller[method]);
        } else {
          router[method](routePath, controller[method]);
        }
      }
    });
  }

  _.forEach(route.children, function(childRoute) {
    generateKoaRoutes(router, childRoute, routePath);
  });
}

// Initialize the Koa router
function initKoaRouter(app) {
  var router = koaRouter();
  generateKoaRoutes(router, routes.app);
  generateKoaRoutes(router, routes.action);
  generateKoaRoutes(router, routes.api);

  var controller = require("../../controllers/API/UserFeedController");
  _.each(_.map(controller.methods, toLowerCase), function(method) {
    if (controller.secure) {
      router[method](controller.path, secure, controller[method]);
    } else {
      router[method](controller.path, controller[method]);
    }
  });

  app.use(router.routes());
}

// Initialize the server side React router
function initReactRouter(app) {
  var apiRegex = new RegExp("^" + routes.API_PREFIX);
  app.use(function *(next) {
    // We only render React components for GET requests to non API routes
    if (this.method !== "GET" || this.path.match(apiRegex)) {
      return yield next;
    }

    ReactRouter.run(routes.react, this.request.path, function(Handler) {
      // Save a reference to the component in state so that the Koa controller render it and pass in any required state
      this.state.reactComponent = Handler;
    }.bind(this));

    yield next;
  });
}

exports.init = function(app) {
  // The react router must come first because it determines which react component needs to be rendered and sets that
  // component in context.state, then the koa router will determine which controller needs to be called so that it can
  // load any data needed to render the react component.
  initReactRouter(app);
  initKoaRouter(app);
};
