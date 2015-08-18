"use strict";

var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var livereload = require("gulp-livereload");
var config = require("./config");

/**
 * Start the server using nodemon and restart when something changes.
 */
gulp.task("dev-server", [ "vendors", "watch" ], function() {
  nodemon({
    script: config.src.server,
    ext: "js jsx",
    env: {
      NODE_ENV: "development"
    },
    execMap: {
      "js": "node --harmony"
    },
    ignore: [
      ".git",
      "node_modules/**/node_modules",
      "bower_components",
      config.src.scss,
      config.src.images,
      config.src.views,
      config.dist.root
    ]
  }).on("restart", function() {
    // Give the server a chance to restart and connect to databases etc before reloading the page
    setTimeout(function() {
      livereload.reload();
    }, 2000);
  });
});
