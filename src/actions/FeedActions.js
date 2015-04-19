"use strict";

var request = require("superagent");
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionType = require("../constants/ActionType");
var UserStore = require("../stores/UserStore");
var FeedStore = require("../stores/FeedStore");

function requestFeed(page, limit, success, failure) {
  var user = UserStore.getUser();

  request.get("/api/user/" + user._id + "/feed")
    .query({ page: page, limit: limit })
    .end(function(err, response) {
      if (response && response.ok) {
        success(page, response.body);
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
    var limit = FeedStore.getPageSize();
    requestFeed(1, limit, this.getFeedSuccess, this.getFeedFailure);
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
