"use strict";

var React = require("react");
var Link = require("react-router").Link;
var State = require("react-router").State;

/**
 * This just puts an active class on <li> tags when they contain the active link so we can add custom style.
 * Thanks - https://github.com/rackt/react-router/blob/master/docs/api/mixins/State.md
 */
var NavLink = React.createClass({
  mixins: [ State ],

  render: function () {
    var isActive = this.isActive(this.props.to, this.props.params, this.props.query);
    var className = isActive ? "active" : "";
    var link = (
      <Link {...this.props} />
    );
    return <li className={className}>{link}</li>;
  }
});

module.exports = NavLink;
