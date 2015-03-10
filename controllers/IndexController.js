"use strict";

exports.get = function *(next) {
  this.state.view = "index";
  yield next;
};
