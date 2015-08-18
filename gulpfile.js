"use strict";

var gulp = require("gulp");
var requireDir = require("require-dir");

// Increase the default max listeners to avoid warnings when we pipe more than 10 files at once
require("events").EventEmitter.defaultMaxListeners = 100;

// Include tasks defined in the tasks directory
requireDir("./tasks");

gulp.task("default", [ "dev" ]);
gulp.task("dev", [ "clean", "vendors", "watch", "dev-server" ]);
gulp.task("build", [ "clean", "vendors", "browserify", "scss", "version-assets", "use-versioned-assets" ]);
