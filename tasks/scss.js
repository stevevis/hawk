"use strict";

var gulp = require("gulp");
var gulpif = require("gulp-if");
var rubySass = require("gulp-ruby-sass");
var minifyCss = require("gulp-minify-css");
var sourcemaps = require("gulp-sourcemaps");
var config = require("./config");

/**
 * Compile our SASS stylesheets.
 */
gulp.task("scss", function() {
  return rubySass(config.src.style, {
    loadPath: config.scssLoadPath,
    compass: true,
    sourcemap: true,
    precision: 10
  })
  .pipe(gulpif(config.isProd, minifyCss()))
  .pipe(gulpif(!config.isProd, sourcemaps.write()))
  .pipe(gulp.dest(config.dist.css));
});
