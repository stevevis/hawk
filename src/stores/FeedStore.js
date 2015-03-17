"use strict";

var assign = require("object-assign");
var EventEmitter = require("events").EventEmitter;
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionType = require("../constants/ActionType");

var CHANGE_EVENT = "change";

var _initialized = false;
var _feed = [];

function initialize() {
  _initialized = true;
}

function updateFeed(feed, page) {
  initialize();

  if (page === 1) {
    _feed = feed;
  } else {
    feed.forEach(function(item) {
      _feed.push(item);
    });
  }
}

var FeedStore = assign({}, EventEmitter.prototype, {

  isInitialized: function() {
    return _initialized;
  },

  getFeed: function() {
    return _feed;
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
  
  switch(action.type) {
    case ActionType.GET_FEED_SUCCESS:
      updateFeed(action.feed, action.page);
      if (action.page > 1) {
        FeedStore.emitChange();
      }
      break;

    default: 
      // no op
  }
});

module.exports = FeedStore;
