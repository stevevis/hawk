"use strict";

var _ = require("lodash");
var router = require("koa-router");

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

// Koa Controllers
var IndexController = require("../controllers/IndexController.js");

// React Components
var HawkApp = require("../components/HawkApp.jsx");
var Feed = require("../components/Feed.jsx");
var Track = require("../components/Track.jsx");

// Helper object for representing routes in a way that we can convert them to either Koa routes or React routes
var SourceRoute = function(name, path, handler, controller, routes, defaultRoute) {
  this.name = name;
  this.path = path;
  this.handler = handler;
  this.controller = controller;
  this.routes = routes ? routes : [];
  this.defaultRoute = defaultRoute ? defaultRoute : false;
};

// The master routes list
var routes = {
  source: [
    new SourceRoute("hawk", "/", HawkApp, IndexController, [
      new SourceRoute("feed", "feed", Feed, IndexController, null),
      new SourceRoute("track", "track", Track, IndexController, null, true)
    ])
  ]
};

// Conver the master routes list into React routes
var generateReactRoutes = function(routes) {
  _.each(routes, function(route) {
    // TODO figure out how to do this programatically, hardcode below for now
  });
};

routes.react = (
  <Route name="hawk" path="/" handler={HawkApp}>
    <Route name="feed" handler={Feed}/>
    <Route name="track" handler={Track}/>
    <DefaultRoute handler={Track}/>
  </Route>
);

// Conver the master routes list into Koa routes
var generateKoaRoutes = function(app, parent, routes) {
  var base = parent ? parent.path : "";
  _.forEach(routes, function(route) {
    if (route.controller && route.controller.get) {
      app.get(base + route.path, route.controller.get);
    }
    if (route.routes && route.routes.length > 0) {
      generateKoaRoutes(app, route, route.routes);
    }
  });
};

// Initialize the Koa router
routes.koaRouter = function(app) {
  app.use(router(app));
  generateKoaRoutes(app, null, routes.source);
};

// Initialize the React router
routes.reactRouter = function *(next) {
  Router.run(routes.react, this.request.path, function(Handler) {
    //this.state.content = React.renderToString(React.createElement(Handler));
    this.state.reactComponent = Handler;
  }.bind(this));

  return yield next;
};

module.exports = routes;
