"use strict";

var _ = require("lodash");
var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var awspublish = require("gulp-awspublish");
var RevAll = require("gulp-rev-all");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var parallelize = require("concurrent-transform");
var shortId = require("shortid");
var config = require("./config");
var awsconfig = require("../src/config/aws");

// Generate a unique version number
var version = shortId.generate();

/**
 * Add version numbers to our compiled assets and publish them to cloudfront.
 */
gulp.task("version-assets", [ "vendors", "images", "browserify", "scss" ], function() {
  var publisher = awspublish.create({
    params: {
      Bucket: awsconfig.S3.bucket.name
    }
  });
  var headers = awsconfig.S3.headers;
  var revAll = new RevAll({
    fileNameManifest: config.manifestFile,
    dontSearchFile: [ config.out.vendor.js ]
  });

  return gulp.src([ config.dist.img + "/*", config.dist.css + "/*.css", config.dist.js + "/*.js" ])
    .pipe(revAll.revision())
    .pipe(rename(function(assetPath) {
      if (assetPath.extname.substr(1) === "js" || assetPath.extname.substr(1) === "css") {
        // e.g. ./app.df80e03c.js -> ./XJVufTnd/js/app.df80e03c.js
        assetPath.dirname = "./" + version + "/" + assetPath.extname.substr(1);
      } else {
        // e.g. ./northern_hawk.df80e03c.jpg -> ./XJVufTnd/img/northern_hawk.df80e03c.jpg
        assetPath.dirname = "./" + version + "/img";
      }
    }))
    .pipe(awspublish.gzip())
    .pipe(parallelize(publisher.publish(headers)))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(config.dist.root));
});

/**
 * Replace paths to local assets with paths to versioned assets in cloudfront.
 */
gulp.task("use-versioned-assets", [ "version-assets" ], function() {
  var manifest = JSON.parse(fs.readFileSync(path.join(config.dist.root, config.manifestFile), "utf8"));

  var viewStream = gulp.src([ config.src.views ]);
  _.forOwn(manifest, function(value, key) {
    var ext = key.split(".").slice(-1)[0];
    if (ext === "js" || ext === "css") {
      viewStream.pipe(replace("/" + key, awsconfig.CloudFront.URL + "/" + version + "/" + value));
    } else {
      viewStream.pipe(replace("/" + key, awsconfig.CloudFront.URL + "/" + version + "/" + value));
    }
  });
  viewStream.pipe(gulp.dest(config.dist.views));
});
