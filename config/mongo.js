"use strict";

var MongoConfig = {
  uri: "mongodb://127.0.0.1/hawk",
  //uri: "mongodb://52.1.155.101/hawk",
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

module.exports = MongoConfig;
