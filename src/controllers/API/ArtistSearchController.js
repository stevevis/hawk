"use strict";

var Artist = require("../../models/Artist");

/**
 * Artist search API
 * GET /api/artist/search?name=<name>
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

  // If a user is logged, get the list of artists that user is watching
  var watching = [];
  if (this.isAuthenticated()) {
    var user = this.passport.user;
    watching = user.watching;
  }

  var artists = yield Artist.findByName(name);

  // Add a watching property to each artist the user is watching
  if (watching.length > 0) {
    artists.forEach(function(artist) {
      watching.forEach(function(artistId) {
        if (artistId === artist._id) {
          artist.watching = true;
        }
      });
    });
  }

  this.body = artists;
  this.status = 200;
};
