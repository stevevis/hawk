"use strict";

var _ = require("lodash");
var fs = require("fs");
var del = require("del");
var path = require("path");
var gulp = require("gulp");
var shortId = require("shortid");
var plugins = require("gulp-load-plugins")();
var parallelize = require("concurrent-transform");
var requireDir = require("require-dir");
var AWSConfig = require("./src/config/aws");

// Increase the default max listeners to avoid warnings when we pipe more than 10 files at once
require("events").EventEmitter.defaultMaxListeners = 100;

// Include tasks defined in the tasks directory
requireDir("./tasks");

var version = shortId.generate();
var prod = process.env.NODE_ENV === "production";

// Source files to read from
var src = {
  app: "./src/app.jsx",
  style: "./src/styles/main.scss",
  scss: "./src/**/*.scss",
  images: "./src/images/**/*",
  views: "./src/views/**/*",
  server: "./src/server.js",
  vendor: {
    css: [
    ],
    head: [
      "./bower_components/modernizr/modernizr.js"
    ],
    js: [
      "./bower_components/jquery/dist/jquery.js",
      "./bower_components/sticky/jquery.sticky.js",
      "./bower_components/fastclick/lib/fastclick.js",
      "./bower_components/foundation/js/foundation.js"
    ]
  }
};

// Paths to load when compiling SCSS
var scssLoadPath = [
  "src/styles",
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

var manifestFile = "manifest.json";

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
 * Gulp Tasks.
 */
gulp.task("default", [ "clean", "setDev", "vendors", "watch", "dev" ]);
gulp.task("build", [ "clean", "setProd", "vendors", "browserify", "scss", "version-assets", "use-versioned-assets" ]);

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
  del.sync([ dist.root ]);
});

/**
 * Compile our SASS stylesheets.
 */
gulp.task("scss", function() {
  return plugins.rubySass(src.style, {
    loadPath: scssLoadPath,
    compass: true,
    sourcemap: true,
    precision: 10
  })
  .pipe(plugins.if(prod, plugins.minifyCss()))
  .pipe(plugins.if(!prod, plugins.sourcemaps.write()))
  .pipe(gulp.dest(dist.css));
});

/**
 * Copy unmodified views to the dist directory (for development).
 */
gulp.task("views", function() {
  return gulp.src(src.views)
    .pipe(gulp.dest(dist.views));
});

/**
 * Minify our images and copy them to the dist directory.
 */
gulp.task("images", function() {
  return gulp.src(src.images)
    .pipe(plugins.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(dist.img));
});

/**
 * Add version numbers to our compiled assets and publish them to cloudfront.
 */
gulp.task("version-assets", [ "vendors", "images", "browserify", "scss" ], function() {
  var publisher = plugins.awspublish.create({
    params: {
      Bucket: AWSConfig.S3.bucket.name
    }
  });
  var headers = AWSConfig.S3.headers;
  var revAll = new plugins.revAll({
    fileNameManifest: manifestFile
  });

  return gulp.src([ dist.img + "/*", dist.css + "/*.css", dist.js + "/*.js" ])
    .pipe(revAll.revision())
    .pipe(plugins.rename(function(assetPath) {
      if (assetPath.extname.substr(1) === "js" || assetPath.extname.substr(1) === "css") {
        // e.g. ./app.df80e03c.js -> ./XJVufTnd/js/app.df80e03c.js
        assetPath.dirname = "./" + version + "/" + assetPath.extname.substr(1);
      } else {
        // e.g. ./northern_hawk.df80e03c.jpg -> ./XJVufTnd/img/northern_hawk.df80e03c.jpg
        assetPath.dirname = "./" + version + "/img";
      }
    }))
    .pipe(plugins.awspublish.gzip())
    .pipe(parallelize(publisher.publish(headers)))
    .pipe(publisher.cache())
    .pipe(plugins.awspublish.reporter())
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(dist.root));
});

/**
 * Replace paths to local assets with paths to versioned assets in cloudfront.
 */
gulp.task("use-versioned-assets", [ "version-assets" ], function() {
  var manifest = JSON.parse(fs.readFileSync(path.join(dist.root, manifestFile), "utf8"));

  var viewStream = gulp.src([ src.views ]);
  _.forOwn(manifest, function(value, key) {
    var ext = key.split(".").slice(-1)[0];
    if (ext === "js" || ext === "css") {
      viewStream.pipe(plugins.replace("/" + key, AWSConfig.CloudFront.URL + "/" + version + "/" + value));
    } else {
      viewStream.pipe(plugins.replace("/" + key, AWSConfig.CloudFront.URL + "/" + version + "/" + value));
    }
  });
  viewStream.pipe(gulp.dest(dist.views));
});

/**
 * Watch our javascript, styles and images and recompile on update.
 */
gulp.task("watch", [ "browserify-watch", "scss", "views", "images" ], function() {
  // Compile and minify our sscs stylesheets
  gulp.watch(src.scss, [ "scss" ]);

  // Copy our views to the dist folder
  gulp.watch(src.views, [ "views" ]);

  // Copy our images to the dist folder
  gulp.watch(src.images, [ "images" ]);

  // Create LiveReload server and watch for changes to front-end code
  plugins.livereload.listen();
  gulp.watch(dist.root + "/**/*.css").on("change", plugins.livereload.changed);
  gulp.watch(dist.root + "/**/*.html").on("change", plugins.livereload.changed);

  plugins.util.log(plugins.util.colors.green("Watching for changes..."));
});

/**
 * Start the server using nodemon and restart when something changes.
 */
gulp.task("dev", [ "vendors", "watch" ], function() {
  plugins.nodemon({
    script: src.server,
    ext: "js jsx",
    env: {
      NODE_ENV: "development"
    },
    execMap: {
      "js": "node"
    },
    ignore: [
      ".git",
      "node_modules/**/node_modules",
      "bower_components",
      src.scss,
      src.images,
      src.views,
      dist.root
    ]
  }).on("restart", function() {
    // Give the server a chance to restart and connect to databases etc before reloading the page
    setTimeout(function() {
      plugins.livereload.reload();
    }, 2000);
  });
});
