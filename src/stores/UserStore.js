"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var ActionType = require("../constants/ActionType");

var CHANGE_EVENT = "change";

var _user = null;

function updateUser(user) {
  _user = user;
}

function updateName(name) {
  if (_user !== null) {
    _user.name = name;
  }
}

var UserStore = assign({}, EventEmitter.prototype, {

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

  switch(action.actionType) {
    case ActionType.USER_UPDATE:
      if (action.user) {
        updateUser(action.user);
      }
      UserStore.emitChange();
      break;

    case ActionType.USER_UPDATE_NAME:
      var name = action.name.trim();
      if (name !== "") {
        updateName(name);
      }
      UserStore.emitChange();
      break;

    default: 
      // no op
  }
});

module.exports = UserStore;
