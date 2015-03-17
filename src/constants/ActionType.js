"use strict";

var keyMirror = require("react/lib/keyMirror");

module.exports = keyMirror({
  GET_USER: null,
  GET_USER_SUCCESS: null,
  GET_USER_FAILURE: null,

  WATCH_ARTIST: null,
  WATCH_ARTIST_SUCCESS: null,
  WATCH_ARTIST_FAILURE: null,

  UNWATCH_ARTIST: null,
  UNWATCH_ARTIST_SUCCESS: null,
  UNWATCH_ARTIST_FAILURE: null,

  GET_FEED: null,
  GET_FEED_SUCCESS: null,
  GET_FEED_FAILURE: null
});