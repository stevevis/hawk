"use strict";

exports.get = function *() {
  this.logout();
  this.session = null;
  this.redirect("/");
};
