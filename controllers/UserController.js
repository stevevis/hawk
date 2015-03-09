"use strict";

var _ = require("lodash");
var logger = require("../config/logger");
var User = require("../models/User");

var whitelist = [
  "test@hawk.com",
  "steve@hawk.com",
]

exports.post = function *() {
  if (_.indexOf(whitelist, this.request.body.email) === -1) {
    this.session.errors = { signupError: true };
    return this.redirect("/");
  }

  var user = new User(this.request.body);
  user = yield user.save();
  logger.debug("Created new user", user.toJSON());

  yield this.login(user);
  this.redirect("track");
};
