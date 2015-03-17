"use strict";

var _ = require("lodash");
var assign = require("object-assign");
var Dispatcher = require("flux").Dispatcher;
var ActionSource = require("../constants/ActionSource.js");

var AppDispatcher = assign(new Dispatcher(), {

  handleViewAction: function(action) {
    if (!action.type) {
      throw new Error("Empty action.type: you likely mistyped the action.");
    }

    this.dispatch(_.assign({
      source: ActionSource.VIEW_ACTION,
    }, action));
  },

  handleServerAction: function(action) {
    if (!action.type) {
      throw new Error("Empty action.type: you likely mistyped the action.");
    }

    this.dispatch(_.assign({
      source: ActionSource.SERVER_ACTION,
    }, action));
  }
  
});

module.exports = AppDispatcher;
