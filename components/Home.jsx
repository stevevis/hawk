"use strict";

var React = require("react");
var Footer = require("./Footer.jsx");
var Login = require("./Login.jsx");
var SignUp = require("./SignUp.jsx");

var Home = React.createClass({
  render: function() {
    var loginMessage = <h6>Got an account? Log in!</h6>;
    if (this.props.data.errors.loginError) {
      loginMessage = <h6 className="error">Sorry, we couldn't log you in.<br/>Please try again.</h6>
    }

    var signupMessage = <h6>New to Hawk? Sign up!</h6>;
    if (this.props.data.errors.signupError) {
      signupMessage = <h6 className="error">Sorry, you're not on the list!</h6>
    }

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
                {loginMessage}
                <Login error={this.props.loginError}/>
              </div>
              <div className="signup-form">
                {signupMessage}
                <SignUp error={this.props.signupError}/>
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
