"use strict";

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var TopBar = require("./TopBar.jsx");

var HawkApp = React.createClass({
  render: function() {
    return (
      <div>
        <TopBar/>
        <RouteHandler/>
      </div>
    );
  }
});

module.exports = HawkApp;
