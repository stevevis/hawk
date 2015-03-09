"use strict";

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var TopBar = require("./TopBar.jsx");

var HawkApp = React.createClass({
  getInitialState: function() {
    return this.props;
  },
  render: function() {
    return (
      <div className="hawk-wrapper">
        <div className="nav-wrapper">
          <TopBar user={this.state.user}/>
        </div>
        <div className="content-wrapper">
          <RouteHandler data={this.state}/>
        </div>
      </div>
    );
  }
});

module.exports = HawkApp;
