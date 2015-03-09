"use strict";

var React = require("react");
var request = require("superagent");
var validator = require("validator");

var Login = React.createClass({
  login: function(e) {
    // TODO Validate the form before submitting
    document.loginForm.submit();
  },
  keyPress: function(e) {
    if (e.key === "Enter") {
      this.login();
    }
  },
  render: function() {
    return (
      <form action="/login" method="post" name="loginForm">
        <div className="row">
          <div className="small-12 columns">
            <input type="email" name="email" placeholder="Email"/>
          </div>
        </div>
         <div className="row">
          <div className="large-12 columns">
            <div className="row collapse">
              <div className="small-9 columns">
                <input type="password" name="password" placeholder="Password" onKeyPress={this.keyPress}/>
              </div>
              <div className="small-3 columns">
                <a href="#" className="button postfix" onClick={this.login}>Login</a>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
});

module.exports = Login;
