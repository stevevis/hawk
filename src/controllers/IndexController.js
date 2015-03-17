"use strict";

var User = require("../models/User");

exports.get = function *(next) {
  this.state.view = "index";

  if (this.isAuthenticated()) {
    this.state.data.feed = yield User.getUserFeedById(this.passport.user._id, 1, 20);
  }

  yield next;
};
