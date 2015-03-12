"use strict";

var React = require("react");

var Feed = React.createClass({
  render: function() {
    return (
      <div className="feed">
        <div className="row">
          <div className="small-12 large-10 large-centered columns">
            <h3>Hello, {this.props.user.name}!</h3>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Feed;
