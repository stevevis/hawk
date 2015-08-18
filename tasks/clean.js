"use strict";

var gulp = require("gulp");
var del = require("del");
var config = require("./config");

/**
 * Delete our compiled assets.
 */
gulp.task("clean", function() {
  del.sync([ config.dist.root ]);
});
