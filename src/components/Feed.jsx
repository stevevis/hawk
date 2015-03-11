"use strict";

var React = require("react");

var Feed = React.createClass({
  render: function() {
    return (
      <div className="release-feed">
        <div className="row">
          <div className="small-12 columns">
            <p>Hello, Hawk!</p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Feed;
