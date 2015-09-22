"use strict";

import React from "react";
import Router from"react-router";

// Load the client routes
import routes from "./config/routes/client";

// Parse the properties sent by the server
var data = JSON.parse(document.getElementById("data").innerHTML);

// Initialize the React router
Router.run(routes.react, Router.HistoryLocation, function(Handler) {
  React.render(React.createElement(Handler, data), document.getElementById("hawk"));
});
