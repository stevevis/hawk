"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util");
var livereload = require("gulp-livereload");
var config = require("./config");

/**
 * Watch our javascript, styles and images and recompile on update.
 */
gulp.task("watch", [ "browserify-watch", "scss", "views", "images" ], function() {
  // Compile and minify our sscs stylesheets
  gulp.watch(config.src.scss, [ "scss" ]);

  // Copy our views to the dist folder
  gulp.watch(config.src.views, [ "views" ]);

  // Copy our images to the dist folder
  gulp.watch(config.src.images, [ "images" ]);

  // Create LiveReload server and watch for changes to front-end code
  livereload.listen();
  gulp.watch(config.dist.root + "/**/*.css").on("change", livereload.changed);
  gulp.watch(config.dist.root + "/**/*.html").on("change", livereload.changed);

  gutil.log(gutil.colors.green("Watching for changes..."));
});
