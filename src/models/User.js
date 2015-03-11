"use strict";

/**
 * Thanks http://ghost-dozoisch.rhcloud.com/integrating-passportjs-with-koa/
 */

var co = require("co");
var bcrypt = require("co-bcrypt");
var mongoose = require("mongoose");
var validator = require("validator");
var logger = require("../config/logger");

var UserSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true, index: true, validate: [validator.isEmail, "Invalid email address"] },
  password: { type: String, require: true }
});

UserSchema.set("toJSON", {
  transform: function(doc, ret) {
    delete ret.password;
  }
});

UserSchema.pre("save", function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  // co.wrap returns a function, calling this function returns a promise
  co.wrap(function *() {
    var salt = yield bcrypt.genSalt(10);
    var hash = yield bcrypt.hash(this.password, salt);
    this.password = hash;
  }).call(this)
  .then(function() {
    next();
  })
  .catch(function(err) {
    logger.error("Caught an error trying to save a user model", err);
    next(err);
  });
});

UserSchema.methods.comparePassword = function *(candidatePassword) {  
  return yield bcrypt.compare(candidatePassword, this.password);
};

UserSchema.statics.matchUser = function *(email, password) {
  var user = yield this.findOne({ "email": email }).exec();

  // Throw an error if the user does not exist
  if (!user) {
    logger.warn("Could not find a user with email %s", email);
    return false;
  }

  // Return the user if the passwords match
  if (yield user.comparePassword(password)) {
    return user;
  }

  // Throw an error if the passwords don't match
  logger.warn("Password did not match for user %s", email);
  return false;
};

var User = mongoose.model("User", UserSchema);

module.exports = User;
