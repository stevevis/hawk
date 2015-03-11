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
            <a href="#">{this.props.user.name}</a>
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
    var menuToggle = "";
    
    if (this.props.user) {
      titleLink = "feed";
      menuToggle = <li className="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>;
    }

    return (
      <nav className="top-bar" data-topbar role="navigation" data-options="mobile_show_parent_link:false">
        <ul className="title-area">
          <li className="name">
            <h1><li><Link to={titleLink}>Music Hawk</Link></li></h1>
          </li>
          {menuToggle}
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
