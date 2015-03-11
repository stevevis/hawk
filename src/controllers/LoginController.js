"use strict";

var passport = require("koa-passport");
var logger = require("../config/logger");

exports.post = function *() {
  var ctx = this;
  yield* passport.authenticate("local", function*(err, user, info) {
    if (err) {
      logger.error("Encountered an error trying to authenticate user with local strategy", err, info);
      throw err;
    }
    if (user === false) {
      logger.warn("Failed to authenticated user");
      ctx.session.errors = { loginError: true };
      ctx.redirect("/");
    } else {
      yield ctx.login(user);
      ctx.redirect("/feed");
    }
  }).call(this);
};
