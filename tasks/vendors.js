"use strict";

var gulp = require("gulp");
var concat = require("gulp-concat");
var gulpif = require("gulp-if");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var config = require("./config");

/**
 * Minify and concatenate our vendor JS and CSS.
 */
gulp.task("vendors", [ "css", "headjs", "bodyjs" ]);

gulp.task("css", function() {
  return gulp.src(config.src.vendor.css)
    .pipe(gulpif(config.isProd, minifyCss()))
    .pipe(concat(config.out.vendor.css))
    .pipe(gulp.dest(config.dist.css));
});

gulp.task("headjs", function() {
  return gulp.src(config.src.vendor.head)
    .pipe(gulpif(config.isProd, uglify()))
    .pipe(concat(config.out.vendor.head))
    .pipe(gulp.dest(config.dist.js));
});

gulp.task("bodyjs", function() {
  return gulp.src(config.src.vendor.js)
    .pipe(gulpif(config.isProd, uglify()))
    .pipe(concat(config.out.vendor.js))
    .pipe(gulp.dest(config.dist.js));
});
