"use strict";

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

// Components
var TopBar = require("./nav/TopBar.jsx");

var HawkApp = React.createClass({

  componentDidMount: function() {
    // Initialize Foundation
    $(document).foundation();
  },

  render: function() {
    return (
      <div className="hawk-wrapper">
        <div className="nav-wrapper fixed">
          <TopBar {...this.props}/>
        </div>
        <div className="content-wrapper">
          <RouteHandler {...this.props}/>
        </div>
      </div>
    );
  },
});

module.exports = HawkApp;
