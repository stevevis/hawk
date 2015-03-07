"use strict";

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var TopBar = require("./TopBar.jsx");

var HawkApp = React.createClass({
  render: function() {
    return (
      <div className="hawk-wrapper">
        <div className="nav-wrapper">
          <TopBar/>
        </div>
        <div className="content-wrapper">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

module.exports = HawkApp;
