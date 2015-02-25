"use strict";

var del = require("del");
var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var browserify = require("browserify");
var watchify = require("watchify");
var reactify = require("reactify");
var envify = require("envify");
var source = require("vinyl-source-stream");

var prod = process.env.NODE_ENV === "production";

var src = {
  app: "./app.js",
  style: "./styles/main.scss",
  img: "./images/**/*",
  views: "./views/**/*",
  server: "./server.js",
  vendor: {
    css: [
    ],
    head: [
      "./bower_components/modernizr/modernizr.js"
    ],
    js: [
      "./bower_components/jquery/dist/jquery.js",
      "./bower_components/fastclick/lib/fastclick.js",
      "./bower_components/foundation/js/foundation.js"
    ]
  }
};

var dist = {
  css: "./dist/css",
  js: "./dist/js",
  img: "./dist/img"
};

var out = {
  app: "app.js",
  style: "main.css",
  vendor: {
    css: "vendor.css",
    head: "head.js",
    js: "vendor.js"
  }
};

// Trigger a livereload when one of these files change
// (And don't trigger a server restart)
var watchReload = Object.keys(dist).map(function(key) {
  return dist[key] + "/**/*";
}).concat([
  src.views
]);

/**
 * Returns a function that logs the error message and displays a notification.
 */
function handleError(task) {
  return function(err) {
    plugins.util.log(plugins.util.colors.red(err));
    plugins.notify.onError(task + " failed, check the logs")(err);
  };
}

/**
 * Browserify and reactify our React app, and optionally watchify it to re-compile on update.
 */
function bundle(watch) {
  var bundler = browserify({
    basedir: __dirname,
    debug: !prod,
    entries: [src.app],
    cache: {}, // required by watchify
    packageCache: {}, // required by watchify
    fullPaths: watch // this only needs to be true for watchify
  });

  if (watch) {
    bundler = watchify(bundler);
  }

  bundler.transform(reactify);
  bundler.transform({global: true}, envify);

  var rebundle = function() {
    var stream = bundler.bundle();
    stream.on("error", handleError("browserify"));
    stream = stream.pipe(source(out.app));

    if (prod) {
      stream.pipe(plugins.streamify(plugins.uglify()));
    }

    return stream.pipe(gulp.dest(dist.js)).pipe(plugins.notify("Finished browserifying " + out.app));
  };

  bundler.on("update", rebundle);
  return rebundle();
}

/**
 * Gulp Tasks.
 */
gulp.task("default", ["clean", "setDev", "vendors", "watch", "dev"]);
gulp.task("build", ["clean", "setProd", "vendors", "browserify", "scss"]);

gulp.task("setDev", function() {
  prod = false;
});

gulp.task("setProd", function() {
  prod = true;
});

/**
 * Delete our compiled assets.
 */
gulp.task("clean", function() {
  del.sync([dist.css, dist.js, dist.img]);
});

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

/**
 * Compile our SASS stylesheets.
 */
gulp.task("scss", function() {
  return plugins.rubySass(src.style, {
    loadPath: ["bower_components/foundation/scss"]
  })
  .pipe(plugins.if(prod, plugins.minifyCss()))
  .pipe(gulp.dest(dist.css));
});

/**
 * Minify and concatenate our vendor JS and CSS.
 */
gulp.task("vendors", ["css", "head", "js"]);

gulp.task("css", function() {
  return gulp.src(src.vendor.css)
    .pipe(plugins.if(prod, plugins.minifyCss()))
    .pipe(plugins.concat(out.vendor.css))
    .pipe(gulp.dest(dist.css));
});

gulp.task("head", function() {
  return gulp.src(src.vendor.head)
    .pipe(plugins.if(prod, plugins.uglify()))
    .pipe(plugins.concat(out.vendor.head))
    .pipe(gulp.dest(dist.js));
});

gulp.task("js", function() {
  return gulp.src(src.vendor.js)
    .pipe(plugins.if(prod, plugins.uglify()))
    .pipe(plugins.concat(out.vendor.js))
    .pipe(gulp.dest(dist.js));
});

/**
 * Watch our javascript, styles and images and recompile on update.
 */
gulp.task("watch", ["browserify-watch", "scss"], function() {
  // Compile and minify our sscs stylesheets
  gulp.watch(src.style, ["scss"]);

  // Create LiveReload server and watch for changes to front-end code
  plugins.livereload.listen();
  gulp.watch(watchReload).on("change", plugins.livereload.changed);

  plugins.util.log(plugins.util.colors.green("Watching for changes..."));
});

/**
 * Start the server using nodemon and restart when something changes.
 */
gulp.task("dev", ["vendors", "watch"], function() {
  plugins.nodemon({
    script: src.server,
    env: {
      NODE_ENV: "development"
    },
    execMap: {
      "js": "node --harmony"
    },
    ignore: [
      ".git",
      "node_modules/**/node_modules",
      "bower_components"
    ].concat(watchReload)
  });
});
