"use strict";

var assign = require("object-assign");
var Dispatcher = require("flux").Dispatcher;
var ActionSource = require("../constants/ActionSource.js");

var AppDispatcher = assign(new Dispatcher(), {

  handleViewAction: function(action) {
    if (!action.type) {
      throw new Error("Empty action.type: you likely mistyped the action.");
    }

    this.dispatch({
      source: ActionSource.VIEW_ACTION,
      action: action
    });
  }

  // TODO Handle server actions like error and success
  
});

module.exports = AppDispatcher;
