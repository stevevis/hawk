"use strict";

var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionType = require("../constants/ActionType");

var UserActions = {
  updateUser: function(user) {
    AppDispatcher.dispatch({
      actionType: ActionType.USER_UPDATE,
      user: user
    });
  },
  
  updateName: function(name) {
    AppDispatcher.dispatch({
      actionType: ActionType.USER_UPDATE_NAME,
      name: name
    });
  }
};

module.exports = UserActions;