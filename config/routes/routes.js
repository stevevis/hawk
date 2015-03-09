"use strict";

var React = require("react");

var HawkApp = require("../../components/HawkApp.jsx");
var Home = require("../../components/Home.jsx");
var Feed = require("../../components/Feed.jsx");
var Track = require("../../components/Track.jsx");

/**
 * We need to give something to the React Router for API endpoints that don't have relevant React components otherwise
 * it will complain about not being able to match the route. So we give it this dummy React component.
 */
var API = React.createClass({
  render: function() {
    return ("");
  }
});

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
var Route = function(name, path, handler, controller, secured, defaultRoute, children) {
  this.name = name;
  this.path = path;
  this.handler = handler;
  this.controller = controller;
  this.secured = secured;
  this.defaultRoute = defaultRoute ? defaultRoute : false;
  this.children = children ? children : [];
};

/* 
 * The master routes list - We use the React components directly because browserify won't include them if we load them
 * dynamically, but we can just store the Koa controllers as strings and load them dynamically since they are only used
 * on the server.
 */
var routes = {
  source: new Route("hawk", "/", HawkApp, "IndexController", false, false, [
    new Route("home", "home", Home, "IndexController", false, true),
    new Route("user", "user", API, "UserController", false, false),
    new Route("login", "login", API, "LoginController", false, false),
    new Route("logout", "logout", API, "LogoutController", true, false),
    new Route("feed", "feed", Feed, "IndexController", true, false),
    new Route("track", "track", Track, "IndexController", true, false)
  ])
};

module.exports = routes;
