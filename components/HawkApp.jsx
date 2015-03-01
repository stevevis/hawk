"use strict";

var React = require("react");

var HawkApp = React.createClass({
  render: function() {
    $(document).foundation();
    return (
      <div className="row">
        <form>
          <div className="small-12 columns">
            <input type="text" className="input-artist" placeholder="Who's your favorite artist/band?" />
          </div>
        </form>
      </div>
    );
  }
});

module.exports = HawkApp;
