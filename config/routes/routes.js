"use strict";

var HawkApp = require("../../components/HawkApp.jsx");
var Home = require("../../components/Home.jsx");
var Feed = require("../../components/Feed.jsx");
var Track = require("../../components/Track.jsx");

/** 
 * Helper object for representing routes in a way that we can convert them to either Koa routes or React routes
 *
 * @param {String} name The name of the route
 * @param {String} path The URL path of the route, relative to it's parent
 * @param {String} handler The name of the React component that should render this path
 * @param {String} controller The name of the Koa controller responsible for this path
 * @param {Route ...} routes The child routes of this route
 * @param {Bool} defaultRoute True if this is the default child for the parent
 */
var Route = function(name, path, handler, controller, children, defaultRoute) {
  this.name = name;
  this.path = path;
  this.handler = handler;
  this.controller = controller;
  this.children = children ? children : [];
  this.defaultRoute = defaultRoute ? defaultRoute : false;
};

/* 
 * The master routes list - We use the React components directly because browserify won't include them if we load them
 * dynamically, but we can just store the Koa controllers as strings and load them dynamically since they are only used
 * on the server.
 */
var routes = {
  source: new Route("hawk", "/", HawkApp, "IndexController", [
    new Route("home", "home", Home, "IndexController", null, true),
    new Route("feed", "feed", Feed, "IndexController", null, false),
    new Route("track", "track", Track, "IndexController", null, false)
  ])
};

module.exports = routes;
