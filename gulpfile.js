"use strict";

var _ = require("lodash");
var fs = require("fs");
var del = require("del");
var shortId = require("shortid");
var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var browserify = require("browserify");
var watchify = require("watchify");
var reactify = require("reactify");
var envify = require("envify");
var source = require("vinyl-source-stream");
var parallelize = require("concurrent-transform");
var AWSConfig = require("./config/aws");

var version = shortId.generate();
var prod = process.env.NODE_ENV === "production";
var cloudFrontUrl = "http://d2pxoitp5g519f.cloudfront.net";

// Source files to read from
var src = {
  app: "./app.jsx",
  style: "./styles/main.scss",
  scss: "./styles/**/*.scss",
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
      "./bower_components/foundation/js/foundation.js",
      "./bower_components/foundation/js/foundation/foundation.topbar.js"
    ]
  }
};

// Paths to load when compiling SCSS
var scssLoadPath = [
  "styles",
  "bower_components/foundation/scss"
];

// Directories to output compilied/minified/uglified assets
var dist = {
  root: "./dist",
  css: "./dist/css",
  js: "./dist/js",
  img: "./dist/img",
  views: "./dist/views"
};

// File names for compiled assets
var out = {
  app: "app.js",
  style: "main.css",
  vendor: {
    css: "vendor.css",
    head: "head.js",
    js: "vendor.js"
  }
};

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

    return stream.pipe(gulp.dest(dist.js));
  };

  bundler.on("update", rebundle);
  return rebundle();
}

/**
 * Gulp Tasks.
 */
gulp.task("default", ["clean", "setDev", "vendors", "watch", "dev"]);
gulp.task("build", ["clean", "setProd", "vendors", "browserify", "scss", "version-assets", "use-versioned-assets"]);

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
  del.sync([dist.root]);
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
    loadPath: scssLoadPath,
    compass: true
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
 * Copy unmodified views to the dist directory (for development).
 */
gulp.task("views", function() {
  return gulp.src(src.views)
    .pipe(gulp.dest(dist.views));
});

/**
 * Add version numbers to our compiled assets and publish them to cloudfront.
 */
gulp.task("version-assets", ["vendors", "browserify", "scss"], function() {
  var publisher = plugins.awspublish.create(AWSConfig.S3.hawk);
  var headers = AWSConfig.S3.headers;

  return gulp.src(["./dist/css/*.css", "./dist/js/*.js"])
    .pipe(plugins.revAll())
    .pipe(plugins.rename(function(path) {
      path.dirname += "/" + version;
    }))
    .pipe(plugins.awspublish.gzip())
    .pipe(parallelize(publisher.publish(headers)))
    .pipe(publisher.cache())
    .pipe(plugins.awspublish.reporter())
    .pipe(plugins.revAll.manifest({ fileName: "manifest.json" }))
    .pipe(gulp.dest(dist.root));
});

/**
 * Replace paths to local assets with paths to versioned assets in cloudfront.
 */
gulp.task("use-versioned-assets", ["version-assets"], function() {
  var manifest = JSON.parse(fs.readFileSync("./dist/manifest.json", "utf8"));
  var viewStream = gulp.src([src.views]);
  _.forOwn(manifest, function(value, key) {
    var ext = key.split(".").slice(-1)[0];
    viewStream.pipe(plugins.replace(ext + "/" + key, cloudFrontUrl + "/" + value));
  });
  viewStream.pipe(gulp.dest(dist.views));
});

/**
 * Watch our javascript, styles and images and recompile on update.
 */
gulp.task("watch", ["browserify-watch", "scss", "views"], function() {
  // Compile and minify our sscs stylesheets
  gulp.watch(src.scss, ["scss"]);

  // Copy our views to the dist folder
  gulp.watch(src.views, ["views"]);

  // Create LiveReload server and watch for changes to front-end code
  plugins.livereload.listen();
  gulp.watch(dist.root + "/**/*").on("change", plugins.livereload.changed);

  plugins.util.log(plugins.util.colors.green("Watching for changes..."));
});

/**
 * Start the server using nodemon and restart when something changes.
 */
gulp.task("dev", ["vendors", "watch"], function() {
  plugins.nodemon({
    script: src.server,
    ext: "js jsx",
    env: {
      NODE_ENV: "development"
    },
    execMap: {
      "js": "node --harmony"
    },
    ignore: [
      ".git",
      "node_modules/**/node_modules",
      "bower_components",
      "components",
      "views",
      "dist"
    ]
  }).on("restart", function() {
    setTimeout(function() {
      plugins.livereload.reload();
    }, 500);
  });
});
