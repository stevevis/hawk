"use strict";

var Artist = require("../../models/Artist");
var User = require("../../models/User");

/**
 * Artist search API
 * GET /api/artist?name=<query>[&userId=<userId>]
 */
exports.get = function *() {
  if (!this.request.query.name) {
    this.status = 400;
    this.body = "Bad Request: Missing name parameter";
    return;
  }

  var name = this.request.query.name.trim();

  if (name.length < 3) {
    this.status = 400;
    this.body = "Bad Request: Name parameter must be at least 3 characters long";
    return;
  }

  var artistsPromise = Artist.findByName(name);
  var watching = [];

  // If a user is logged, get the list of artists that user is watching
  if (this.isAuthenticated()) {
    var userId = this.passport.user._id;
    var watchingPromise = User.getWatchedArtistsByUserId(userId);
    watching = yield watchingPromise;
  }

  var artists = yield artistsPromise;

  // Add a watching property to each artist the user is watching
  if (watching.length > 0) {
    artists.forEach(function(artist) {
      watching.forEach(function(watch) {
        if (watch._id === artist._id) {
          artist.watching = true;
        }
      });
    });
  }

  this.body = artists;
  this.status = 200;
  return;
};
