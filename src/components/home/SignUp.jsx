"use strict";

var React = require("react");
var validator = require("validator");

var SignUp = React.createClass({
  createUser: function(e) {
    // TODO Validate the form before submitting
    document.signupForm.submit();
  },
  keyPress: function(e) {
    if (e.key === "Enter") {
      this.createUser();
    }
  },
  render: function() {
    return (
      <form action="/signup" method="post" name="signupForm">
        <div className="row">
          <div className="small-12 columns">
            <input type="text" placeholder="Name" name="name"/>
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <input type="email" placeholder="Email" name="email"/>
          </div>
        </div>
         <div className="row">
          <div className="large-12 columns">
            <div className="row collapse">
              <div className="small-9 columns">
                <input type="password" placeholder="Password" name="password" onKeyPress={this.keyPress}/>
              </div>
              <div className="small-3 columns">
                <a href="#" className="button postfix" onClick={this.createUser}>Sign Up</a>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
});

module.exports = SignUp;
