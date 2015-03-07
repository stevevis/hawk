"use strict";

var React = require("react");
var Footer = require("./Footer.jsx");

var Home = React.createClass({
  render: function() {
    return (
      <div className="home">
        <div className="content">
          <div className="row">
            <div className="small-12 medium-6 columns">
              <div className="welcome">
                <h3>Track your favorite artists like a hawk!</h3>
                <br/>
                <h4>Tell Music Hawk who your favorite artists are and she will make sure you know whenever they release new music.</h4>
              </div>
            </div>
            <div className="small-12 medium-6 large-4 columns">
              <div className="login-form">
                Login
              </div>
              <div className="signup-form">
                Sign Up
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = Home;
