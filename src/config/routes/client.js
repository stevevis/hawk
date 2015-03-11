"use strict";

var _ = require("lodash");
var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRouter = Router.NotFoundRoute;

// The master routes module, we'll add the react routes to this
var routes = require("./routes.js");

// Conver the master routes list into React routes
function generateReactRoutes(parent) {
  var children = [];

  _.each(parent.children, function(route) {
    children.push(generateReactRoutes(route));
    if (route.defaultRoute) {
      children.push(React.createElement(DefaultRoute, { handler: route.handler, key: route.name + ":default" }));
      children.push(React.createElement(NotFoundRouter, { handler: route.handler, key: route.name + ":notfound" }));
    }
  });

  var props = { name: parent.name, handler: parent.handler, key: parent.name };
  if (parent.path) {
    props.path = parent.path;
  }

  return React.createElement(Route, props, children);
}

routes.react = generateReactRoutes(routes.source);

module.exports = routes;
