"use strict";

var React = require("react");
var Link = require("react-router").Link;

var TopBar = React.createClass({
  render: function() {
    return (
      <div className="nav-wrapper">
        <nav className="top-bar" data-topbar role="navigation">
          <ul className="title-area">
            <li className="name">
              <h1><li><Link to="hawk">Music Hawk</Link></li></h1>
            </li>
            { /* Remove the class "menu-icon" to get rid of menu icon. Take out "Menu" to just have icon alone */ }
            <li className="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
          </ul>

          <section className="top-bar-section">
            { /* Right Nav Section */ }
            <ul className="right">
            </ul>

            { /* Left Nav Section */ }
            <ul className="left">
              <li><Link to="feed">Feed</Link></li>
              <li><Link to="track">Track</Link></li>
            </ul>
          </section>
        </nav>
      </div>
    );
  }
});

module.exports = TopBar;
