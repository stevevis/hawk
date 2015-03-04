"use strict";

var React = require("react");
var HawkApp = require("./components/HawkApp.jsx");

$(document).foundation();

React.render(
  <HawkApp/>,
  document.getElementById("hawk-app")
);


