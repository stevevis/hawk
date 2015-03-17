"use strict";

/**
 * Thanks - http://ghost-dozoisch.rhcloud.com/integrating-passportjs-with-koa/
 */

var co = require("co");
var session = require("koa-generic-session");
var MongoStore = require("koa-generic-session-mongo");
var passport = require("koa-passport");
var LocalStrategy = require("passport-local").Strategy;
var logger = require("../config/logger");

// Config
var mongoConfig = require("../config/mongo");

// Models
var User = require("../models/User");

var AuthLocalUser = function(email, password, done) {
  co(function *() {
    return yield User.matchUser(email, password);
  })
  .then(function(user) {
    done(null, user);
  })
  .catch(function(err) {
    done(err);
  });
};

var serializeUser = function(user, done) {
  done(null, user._id);
};

var deserializeUser = function(id, done) {
  User.findById(id, "-feed", done);
};

exports.init = function(app) {
  // Setup the session store
  var sessionStore = new MongoStore({ 
    url: mongoConfig.uri,
    user: mongoConfig.options.user,
    password: mongoConfig.options.password
  });

  // Initialize the session middleware
  app.use(session({
    key: process.env.HAWK_APP_KEY,
    store: sessionStore
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup our authentication handlers
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  }, AuthLocalUser));

  // If the request is authenticated, add the user object to context.state.data
  app.use(function *(next) {
    if (this.isAuthenticated()) {
      this.state.data.user = this.passport.user.toJSON();
      logger.debug("Current user is", this.passport.user.toJSON());
    }
    yield next;
  });
};
