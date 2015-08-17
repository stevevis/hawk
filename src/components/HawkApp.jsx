"use strict";

import React from "react";
import RouteHandler from "react-router";

// Components
import TopBar from "./nav/TopBar.jsx";

// Actions
import UserActions from "../actions/UserActions";

class HawkApp extends React.Component {

  componentDidMount() {
    // Initialize Foundation
    $(document).foundation();

    // Initialize the user store
    UserActions.getUserSuccess(this.props.user);
  }

  render() {
    return (
      <div className="hawk-wrapper">
        <div className="nav-wrapper fixed">
          <TopBar {...this.props}/>
        </div>
        <div className="content-wrapper">
          <RouteHandler.RouteHandler {...this.props}/>
        </div>
      </div>
    );
  }
}

HawkApp.propTypes = {
  user: React.PropTypes.object
};

export default HawkApp;
