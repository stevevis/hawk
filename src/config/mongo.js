/* eslint no-process-env: "off" */

const _ = require("lodash");

const env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

const base = {
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

const specific = {
  development: {
    // uri: "mongodb://52.10.208.97/hawk"
    uri: "mongodb://127.0.0.1/hawk"
  },
  production: {
    uri: "mongodb://127.0.0.1/hawk"
  }
};

module.exports = _.merge(base, specific[env]);
