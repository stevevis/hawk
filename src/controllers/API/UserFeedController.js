"use strict";

var logger = require("../../config/logger");
var User = require("../../models/User");

/**
 * Get a user's feed
 * GET /api/user/:userId/feed[?limit=<limit>][&page=<page>]
 */
exports.get = function *() {
  var page = this.request.query.page ? parseInt(this.request.query.page) : 1;
  var limit = this.request.query.limit ? parseInt(this.request.query.limit) : 20;
  logger.info("Requested user %s feed page %d limit %d", this.params.userId, page, limit);

  this.body = yield User.getUserFeedById(this.params.userId, page, limit);
  this.status = 200;
};
