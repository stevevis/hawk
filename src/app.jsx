"use strict";

var React = window.React = require("react");
var Router = require("react-router");

// Load the client routes
var routes = require("./config/routes/client");

// Parse the properties sent by the server
var data = JSON.parse(document.getElementById("data").innerHTML);

// Initialize the React router
Router.run(routes.react, Router.HistoryLocation, function(Handler) {
  React.render(React.createElement(Handler, data), document.getElementById("hawk"));
});
