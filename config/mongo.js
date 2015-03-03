"use strict";

var _ = require("lodash");

var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

var base = {
  options: {
    user: "hawk",
    pass: "hawk",
    server: {
      poolSize: 40,
      socketOptions: {
        keepAlive: 1
      }
    }
  }
};

var specific = {
  development: {
    uri: "mongodb://52.1.155.101/hawk"
  },
  production: {
    uri: "mongodb://127.0.0.1/hawk"
  }
};

module.exports = _.merge(base, specific[env]);
