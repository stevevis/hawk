const gulp = require("gulp");
const gutil = require("gulp-util");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");

const webpackConfig = require("../webpack/webpack-dev.config.js");

gulp.task("webpack-dev-server", (callback) => {
  // Start a webpack-dev-server
  const compiler = webpack(webpackConfig);
  const host = webpackConfig.devServer.host;
  const port = webpackConfig.devServer.port;

  new WebpackDevServer(compiler, webpackConfig.devServer).listen(port, host, (err) => {
    if (err) {
      throw new gutil.PluginError("webpack-dev-server", err);
    }
    // Server listening
    gutil.log("[webpack-dev-server]", `Listening at: http://${host}:${port}/webpack-dev-server`);

    callback();
  });
});
