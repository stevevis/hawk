"use strict";

var request = require("superagent");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionType = require("../constants/ActionType");
var UserStore = require("../stores/UserStore");

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

  watchArtist: function(artistId) {
    AppDispatcher.dispatch({
      actionType: ActionType.USER_WATCH_ARTIST,
      artistId: artistId
    });

    var user = UserStore.getUser();
    request.put("/api/user/" + user._id + "/feed/" + artistId)
      .end(function(err, response) {
        if (err || !response.ok) {
          // Fire a server action to handle the error
          console.log("Server error trying to watch artist");
        }
      });
  },

  unwatchArtist: function(artistId) {
    AppDispatcher.dispatch({
      actionType: ActionType.USER_UNWATCH_ARTIST,
      artistId: artistId
    });

    var user = UserStore.getUser();
    request.del("/api/user/" + user._id + "/feed/" + artistId)
      .end(function(err, response) {
        if (err || !response.ok) {
          // Fire a server action to handle the error
          console.log("Server error trying to un-watch artist");
        }
      });
  }
};

module.exports = UserActions;
