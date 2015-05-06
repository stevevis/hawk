"use strict";

var _ = require("lodash");
var logger = require("../config/logger");
var User = require("../models/User");

var whitelist = [
  "test@hawk.com",
  "steve@hawk.com",
  "tima@hawk.com"
];

exports.post = function *() {
  if (_.indexOf(whitelist, this.request.body.email) === -1) {
    this.session.errors = { signupError: "Sorry, you're not on the list. Check back when we launch!" };
    return this.redirect("/");
  }

  try {
    var user = new User(this.request.body);
    user = yield user.save();
    logger.debug("Created new user", user.toJSON());
    yield this.login(user);
    this.redirect("watch");
  } catch (e) {
    logger.warn(e.message);
    if (e.message.match(/duplicate key error/)) {
      this.session.errors = { signupError: "It looks like you're already signed up." };
    }
    return this.redirect("/");
  }
};
