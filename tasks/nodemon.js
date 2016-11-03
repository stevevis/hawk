const gulp = require("gulp");
const nodemon = require("gulp-nodemon");

/**
 * Start the server using nodemon and restart when something changes.
 */
gulp.task("nodemon", ["webpack-dev-server", "inject-assets:dev"], () => {
  nodemon({
    script: "src/babel-server.js",
    ext: "js",
    env: {
      NODE_ENV: "development"
    },
    watch: [
      "src/server.js",
      "src/controllers"
    ]
  });
});
