"use strict";

var watchify = require("watchify");
var browserify = require("browserify");
var babelify = require("babelify");
var envify = require("envify");
var gulp = require("gulp");
var gulpif = require("gulp-if");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var gutil = require("gulp-util");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var assign = require("lodash").assign;
var config = require("./config");

function rebundle(bundler) {
  return bundler.bundle()
    // log errors if they happen
    .on("error", gutil.log.bind(gutil, "Browserify Error"))
    .pipe(source(config.out.app))
    // optional, remove if you don"t need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(gulpif(!config.isProd, sourcemaps.init({ loadMaps: true }))) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(gulpif(config.isProd, uglify()))
    .pipe(sourcemaps.write("./")) // writes .map file
    .pipe(gulp.dest(config.dist.js));
}

function bundle(watch) {
  var opts = {
    debug: !config.isProd,
    entries: [ config.src.app ]
  };

  if (watch) {
    opts = assign({}, watchify.args, opts);
  }

  var bundler = browserify(opts);

  if (watch) {
    bundler = watchify(bundler);
    bundler.on("update", rebundle.bind(this, bundler));
  }

  bundler.transform(babelify);
  bundler.transform({ global: true }, envify);

  return rebundle(bundler);
}

/**
 * Compile our React app.
 */
gulp.task("browserify", function() {
  return bundle(false);
});

/**
 * Compile our React app, and re-compile on update.
 */
gulp.task("browserify-watch", function() {
  return bundle(true);
});
