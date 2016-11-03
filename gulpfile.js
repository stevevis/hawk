const gulp = require("gulp");
const requireDir = require("require-dir");

// Increase the default max listeners to avoid warnings when we pipe more than 10 files at once
require("events").EventEmitter.defaultMaxListeners = 100;

// Include tasks defined in the tasks directory
requireDir("./tasks");

gulp.task("default", ["dev"]);
gulp.task("dev", ["webpack-dev-server", "inject-assets:dev", "nodemon"]);
gulp.task("build", ["eslint", "webpack", "inject-assets:prod"]);
