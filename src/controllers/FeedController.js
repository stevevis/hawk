"use strict";

var logger = require("../config/logger");
var Artist = require("../models/Artist");
var User = require("../models/User");

/**
 * Add artist to feed (watch) API
 * PUT /api/user/:userId/feed/:artistId
 */
exports.put = function *() {
  logger.info("User %s is now watching artist %s", this.params.userId, this.params.artistId);

  var artistId = parseInt(this.params.artistId);
  var feed = yield Artist.getArtistFeedById(artistId);
  yield User.update({ _id: this.params.userId }, { $addToSet: { feed: { $each: feed } } }, { upsert: true }).exec();

  this.status = 201;
  return;
};

/**
 * Delete artist from feed (un-watch) API
 * DELETE /api/user/:userId/feed/:artistId
 */
exports.del = function *() {
  logger.info("User %s is not watching artist %s", this.params.userId, this.params.artistId);

  var artistId = parseInt(this.params.artistId);
  yield User.update({ _id: this.params.userId }, { $pull: { feed: { "artist_id": artistId } } }).exec();

  this.status = 204;
  return;
};

/**
 * Get feed API
 * GET /api/user/:userId/feed[?limit=<limit>][&page=<page>]
 */
exports.get = function *() {
  var page = this.request.query.page || 1;
  var limit = this.request.query.limit || 20;
  logger.info("Requested user %s feed page %d limit %d", this.params.userId, page, limit);

  this.body = yield User.getUserFeedById(this.params.userId, page, limit);
  this.status = 200;
  return;
};
