"use strict";

var React = require("react");

var TopBar = require("./TopBar.jsx");
var Track = require("./Track.jsx");
var Feed = require("./Feed.jsx");

var HawkApp = React.createClass({
  render: function() {
    return (
      <div>
        <TopBar/>
        <Track/>
      </div>
    );
  }
});

module.exports = HawkApp;
