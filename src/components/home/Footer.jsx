"use strict";

var React = require("react");

var Footer = React.createClass({
  render: function() {
    return (
      <div className="footer">
        <div className="row">
          <div className="small-12 columns">
            <div className="footer-content text-center">
              <span>&copy; 2015 Steve Viselli</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Footer;
