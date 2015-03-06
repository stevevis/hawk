"use strict";

var React = window.React = require("react");
var Router = require("react-router");

// Load the client routes
var routes = require("./config/routes/client");

// Initialize Foundation
$(document).foundation();

// Initialize the React router
Router.run(routes.react, Router.HistoryLocation, function(Handler) {
  React.render(<Handler/>, document.getElementById("hawk-app"));
});
