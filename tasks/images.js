"use strict";

var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var config = require("./config");

/**
 * Minify our images and copy them to the dist directory.
 */
gulp.task("images", function() {
  return gulp.src(config.src.images)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(config.dist.img));
});
