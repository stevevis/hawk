"use strict";

var assign = require("object-assign");
var EventEmitter = require("events").EventEmitter;
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionType = require("../constants/ActionType");

var CHANGE_EVENT = "change";
var PAGE_SIZE = 20;

var _initialized = false;
var _feed = [];
var _releaseIds = {}; // A map of release IDs currently in the feed, to prevent duplicates.
var _complete = false; // True if there are no more releases to load from the server.

function initialize() {
  _initialized = true;
}

function updateFeed(feed, page) {
  initialize();

  if (page === 1) {
    _feed = [];
    _releaseIds = {};
    _complete = false;
  }

  if (feed.length < PAGE_SIZE) {
    _complete = true;
  }

  feed.forEach(function(item) {
    if (!_releaseIds[item.rid]) {
      _feed.push(item);
      _releaseIds[item.rid] = true;
    }
  });
}

var FeedStore = assign({}, EventEmitter.prototype, {

  isInitialized: function() {
    return _initialized;
  },

  getFeed: function() {
    return _feed;
  },

  getPageSize: function() {
    return PAGE_SIZE;
  },

  getNextPageNumber: function() {
    if (_complete) {
      return 0;
    } else {
      return Math.ceil(_feed.length / PAGE_SIZE) + 1;
    }
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
      FeedStore.emitChange();
      break;

    default: 
      // no op
  }
});

module.exports = FeedStore;
