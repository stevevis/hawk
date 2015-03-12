"use strict";

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

// Components
var TopBar = require("./nav/TopBar.jsx");

// Actions
var UserActions = require("../actions/UserActions");

// Stores
var UserStore = require("../stores/UserStore");

var HawkApp = React.createClass({
  getInitialState: function() {
    return this.props;
  },

  componentDidMount: function() {
    UserActions.updateUser(this.props.user);
    UserStore.addChangeListener(this._onUserChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onUserChange);
  },

  render: function() {
    return (
      <div className="hawk-wrapper">
        <div className="nav-wrapper fixed">
          <TopBar {...this.state}/>
        </div>
        <div className="content-wrapper">
          <RouteHandler {...this.state}/>
        </div>
      </div>
    );
  },

  _onUserChange: function() {
    this.setState({user: UserStore.getUser()});
  }
});

module.exports = HawkApp;
