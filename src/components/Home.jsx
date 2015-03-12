"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var Footer = require("./home/Footer.jsx");
var Login = require("./home/Login.jsx");
var SignUp = require("./home/SignUp.jsx");

var Home = React.createClass({
  mixins: [Navigation],

  componentDidMount: function() {
    if (this.props.user) {
      this.replaceWith("feed");
    }
  },

  render: function() {
    var loginMessage = <h6>Got an account? Log in!</h6>;
    if (this.props.errors.loginError) {
      loginMessage = <h6 className="error">{{__html: this.props.errors.loginError}}</h6>;
    }

    var signupMessage = <h6>New to Hawk? Sign up!</h6>;
    if (this.props.errors.signupError) {
      signupMessage = <h6 className="error">{{__html: this.props.errors.signupError}}</h6>;
    }

    return (
      <div className="home">
        <div className="row">
          <div className="small-12 medium-6 columns">
            <div className="welcome">
              <h3>Track your favorite artists like a hawk!</h3>
              <br/>
              <h4>Tell <span className="primary">Music Hawk</span> who your favorite artists are and she will make sure you know whenever they release new music.</h4>
            </div>
          </div>
          <div className="small-12 medium-6 large-4 columns">
            <div className="login-form">
              {loginMessage}
              <Login/>
            </div>
            <div className="signup-form">
              {signupMessage}
              <SignUp/>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = Home;
