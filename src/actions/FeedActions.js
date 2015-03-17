"use strict";

var request = require("superagent");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionType = require("../constants/ActionType");
var UserStore = require("../stores/UserStore");

var DEFAULT_FEED_LIMIT = 20;

function requestFeed(page, limit, success, failure) {
  var _page = page || 1,
      _limit = limit || DEFAULT_FEED_LIMIT,
      user = UserStore.getUser();

  request.get("/api/user/" + user._id + "/feed")
    .query({ page: _page, limit: _limit })
    .end(function(err, response) {
      if (response && response.ok) {
        success(_page, response.body);
      } else {
        failure(err);
      }
    });
}

var FeedActions = {
  getFeed: function(page, limit) {
    AppDispatcher.handleViewAction({
      type: ActionType.GET_FEED,
      page: page,
      limit: limit
    });

    requestFeed(page, limit, this.getFeedSuccess, this.getFeedFailure);
  },

  reloadFeed: function() {
    requestFeed(1, DEFAULT_FEED_LIMIT, this.getFeedSuccess, this.getFeedFailure);
  },

  getFeedSuccess: function(page, feed) {
    AppDispatcher.handleServerAction({
      type: ActionType.GET_FEED_SUCCESS,
      page: page,
      feed: feed
    });
  },

  getFeedFailure: function(err) {
    AppDispatcher.handleServerAction({
      type: ActionType.GET_FEED_FAILURE,
      err: err
    });
  }
};

module.exports = FeedActions;
