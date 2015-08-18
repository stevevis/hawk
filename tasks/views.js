"use strict";

var gulp = require("gulp");
var config = require("./config");

/**
 * Copy unmodified views to the dist directory (for development).
 */
gulp.task("views", function() {
  return gulp.src(config.src.views)
    .pipe(gulp.dest(config.dist.views));
});
