"use strict";

var React = window.React = require("react");
var Router = require("react-router");

// Load the client routes
var routes = require("./config/routes/client");

// Initialize Foundation
$(document).foundation();

// Parse the properties sent by the server
var props = JSON.parse(document.getElementById("props").innerHTML);

// Initialize the React router
Router.run(routes.react, Router.HistoryLocation, function(Handler) {
  React.render(React.createElement(Handler, props), document.getElementById("hawk"));
});
