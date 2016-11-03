const gulp = require("gulp");
const inject = require("gulp-inject");
const injectString = require("gulp-inject-string");
const awsConfig = require("../src/config/aws");
const webpackConfig = require("../webpack/webpack-dev.config.js");

gulp.task("inject-assets:prod", ["webpack"], (callback) => {
  gulp.src("src/views/*.html")
    .pipe(inject(gulp.src("dist/**/*", { read: false }), {
      ignorePath: "dist/assets",
      addPrefix: awsConfig.CloudFront.URL
    }))
    .pipe(gulp.dest("dist/views"));

  callback();
});

gulp.task("inject-assets:dev", (callback) => {
  const devServer = `http://${webpackConfig.devServer.host}:${webpackConfig.devServer.port}`;
  const vendor = `\t\t<script src=\"${devServer}/vendor.js\"></script>`;
  const app = `\t\t<script src=\"${devServer}/app.js\"></script>`;

  gulp.src("src/views/*.html")
    .pipe(injectString.after("<!-- inject:js -->", `\n${vendor}\n${app}`))
    .pipe(gulp.dest("dist/views"));

  callback();
});
