"use strict";

var Artist = require("../models/Artist");

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

  this.status = 200;
  this.body = yield Artist.findByName(name);
  return;
};