"use strict";

var request = require("superagent");
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
  },

  watchArtist: function(userId, artistId) {
    AppDispatcher.dispatch({
      actionType: ActionType.USER_WATCH_ARTIST,
      artistId: artistId
    });

    request.put("/api/user/" + userId + "/artists/" + artistId)
      .end(function(response) {
        if (!response.ok) {
          // Fire a server action to handle the error
          console.log("Server error trying to watch artist");
        }
      });
  }
};

module.exports = UserActions;
