"use strict";

var React = require("react");

var TopBar = React.createClass({
  render: function() {
    return (
      <div className="nav-wrapper">
        <nav className="top-bar" data-topbar role="navigation">
          <ul className="title-area">
            <li className="name">
              <h1><li><a href="#">Music Hawk</a></li></h1>
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
              <li><a href="#">Feed</a></li>
              <li><a href="#">Track</a></li>
            </ul>
          </section>
        </nav>
      </div>
    );
  }
});

module.exports = TopBar;
