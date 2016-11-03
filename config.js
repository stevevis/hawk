/* eslint no-process-env: "off" */

const _ = require("lodash");

const env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

const base = {
  server: "src/babel-server.js"
};

const specific = {
  development: {

  },
  production: {

  }
};

module.exports = _.merge(base, specific[env]);
