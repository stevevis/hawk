"use strict";

var request = require("superagent");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionType = require("../constants/ActionType");
var UserStore = require("../stores/UserStore");
var FeedActions = require("./FeedActions");

var UserActions = {
  getUserSuccess: function(user) {
    AppDispatcher.handleServerAction({
      type: ActionType.GET_USER_SUCCESS,
      user: user
    });
  },

  watchArtist: function(artistId) {
    AppDispatcher.handleViewAction({
      type: ActionType.WATCH_ARTIST,
      artistId: artistId
    });

    var user = UserStore.getUser();

    request.put("/api/user/" + user._id + "/feed/" + artistId)
      .end(function(err, response) {
        if (response && response.ok) {
          UserActions.watchArtistSuccess(artistId);
        } else {
          UserActions.watchArtistFailure(artistId);
        }
      });
  },

  watchArtistSuccess: function(artistId) {
    AppDispatcher.handleServerAction({
      type: ActionType.WATCH_ARTIST_SUCCESS,
      artistId: artistId
    });

    FeedActions.reloadFeed();
  },

  watchArtistFailure: function(artistId) {
    AppDispatcher.handleServerAction({
      type: ActionType.WATCH_ARTIST_FAILURE,
      artistId: artistId
    });
  },

  unwatchArtist: function(artistId) {
    AppDispatcher.handleViewAction({
      type: ActionType.UNWATCH_ARTIST,
      artistId: artistId
    });

    var user = UserStore.getUser();

    request.del("/api/user/" + user._id + "/feed/" + artistId)
      .end(function(err, response) {
        if (response && response.ok) {
          UserActions.unwatchArtistSuccess(artistId);
        } else {
          UserActions.unwatchArtistFailure(artistId);
        }
      });
  },

  unwatchArtistSuccess: function(artistId) {
    AppDispatcher.handleServerAction({
      type: ActionType.UNWATCH_ARTIST_SUCCESS,
      artistId: artistId
    });

    FeedActions.reloadFeed();
  },

  unwatchArtistFailure: function(artistId) {
    AppDispatcher.handleServerAction({
      type: ActionType.UNWATCH_ARTIST_FAILURE,
      artistId: artistId
    });
  },
};

module.exports = UserActions;
