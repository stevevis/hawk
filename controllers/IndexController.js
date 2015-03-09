"use strict";

var React = require("react");
var logger = require("../config/logger");

exports.get = function *(next) {
  this.state.view = "index";
  if (this.session.errors) {
    this.state.props.errors = this.session.errors;
    this.session.errors = false;
  }
  yield next;
};
