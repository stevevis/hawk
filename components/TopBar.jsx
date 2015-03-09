"use strict";

var React = require("react");
var Link = require("react-router").Link;

var TopBar = React.createClass({
  renderLeftLinks: function() {
    if (this.props.user) {
      return (
        <ul className="left">
          <li><Link to="feed">Feed</Link></li>
          <li><Link to="track">Track</Link></li>
        </ul>
      );
    } else {
      return ("");
    }
  },
  renderRightLinks: function() {
    if (this.props.user) {
      return (
        <ul className="right">
          <li className="has-dropdown">
            <a href="#">Hello, {this.props.user.name}</a>
            <ul className="dropdown">
              <li><a href="/logout">Log out</a></li>
            </ul>
          </li>
        </ul>
      );
    } else {
      return ("");
    }
  },
  render: function() {
    var titleLink = "hawk";
    if (this.props.user) {
      titleLink = "feed";
    }
    return (
      <nav className="top-bar" data-topbar role="navigation">
        <ul className="title-area">
          <li className="name">
            <h1><li><Link to={titleLink}>Music Hawk</Link></li></h1>
          </li>
          { /* Remove the class "menu-icon" to get rid of menu icon. Take out "Menu" to just have icon alone */ }
          <li className="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
        </ul>

        <section className="top-bar-section">
          {this.renderRightLinks()}
          {this.renderLeftLinks()}
        </section>
      </nav>
    );
  }
});

module.exports = TopBar;
