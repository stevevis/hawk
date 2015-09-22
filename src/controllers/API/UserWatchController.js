"use strict";

var logger = require("../../config/logger");
var Artist = require("../../models/Artist");
var User = require("../../models/User");

/**
 * Get list of artist IDs that a user is watching
 * GET /api/user/:userId/watching
 */
exports.get = function *() {
  var user = yield User.findById(this.params.userId).exec();
  this.body = user.watching;
  this.status = 200;
};

/**
 * Watch an artist
 * PUT /api/user/:userId/watching/:artistId
 */
exports.put = function *() {
  logger.info("User %s is now watching artist %s", this.params.userId, this.params.artistId);

  var user = yield User.findById(this.params.userId).select("+feed").exec(),
      artistId = parseInt(this.params.artistId),
      index = user.watching.indexOf(artistId);

  if (index > -1) {
    // User is already watching this artist
    this.status = 403;
    return;
  }

  // Update the user's watching list
  user.watching.push(artistId);

  // Update the user's feed
  var feed = yield Artist.getArtistFeedById(artistId);
  user.feed = user.feed.concat(feed);

  yield user.save();
  this.status = 201;
};

/**
 * Unwatch an artist
 * DELETE /api/user/:userId/watching/:artistId
 */
exports.del = function *() {
  logger.info("User %s is not watching artist %s", this.params.userId, this.params.artistId);

  var user = yield User.findById(this.params.userId).select("+feed").exec(),
      artistId = parseInt(this.params.artistId),
      index = user.watching.indexOf(artistId);

  if (index === -1) {
    // User isn't watching this artist
    this.status = 404;
    return;
  }

  // Update the user's watching list
  user.watching.splice(index, 1);

  // Update the user's feed
  user.feed = user.feed.filter(function(release) {
    return release.aid !== artistId;
  });

  yield user.save();
  this.status = 204;
};
