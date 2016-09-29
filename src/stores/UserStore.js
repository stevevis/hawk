"use strict";

var assign = require("object-assign");
var EventEmitter = require("events").EventEmitter;
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionType = require("../constants/ActionType");

var CHANGE_EVENT = "change";

var _initialized = false;
var _user = null;

function initialize() {
  _initialized = true;
}

function updateUser(user) {
  initialize();
  _user = user;
}

var UserStore = assign({}, EventEmitter.prototype, {

  isInitialized: function() {
    return _initialized;
  },

  getUser: function() {
    return _user;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionType.GET_USER_SUCCESS:
      updateUser(action.user);
      UserStore.emitChange();
      break;

    default: // no op
  }
});

module.exports = UserStore;
