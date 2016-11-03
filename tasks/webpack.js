const gulp = require("gulp");
const gutil = require("gulp-util");
const webpack = require("webpack");

const webpackConfig = require("../webpack/webpack-prod.config.js");

gulp.task("webpack", ["clean"], (callback) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      chunks: false,
      colors: true
    }));

    callback();
  });
});
