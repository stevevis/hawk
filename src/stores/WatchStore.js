"use strict";

var assign = require("object-assign");
var EventEmitter = require("events").EventEmitter;
var AppDispatcher = require("../dispatcher/AppDispatcher");
var ActionType = require("../constants/ActionType");

var CHANGE_EVENT = "change";

var _initialized = false;
var _hasChanged = false; // True if the artist store has changed since the last feed reload, otherwise false.
var _watching = {}; // Map of ArtistId -> Artist Object, these artists are being watched by the user.

function initialize() {
  _initialized = true;
}

function watchArtist(artistId) {
  initialize();
}

var WatchStore = assign({}, EventEmitter.prototype, {

  isInitialized: function() {
    return _initialized;
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
      if (action.page === 0) {
        _hasChanged = false;
      }
      break;

    case ActionType.WATCH_ARTIST_SUCCESS:
      watchArtist(action.artist);
      WatchStore.emitChange();
      break;

    default: 
      // no op
  }
});

module.exports = WatchStore;
