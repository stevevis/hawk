"use strict";

var _ = require("lodash");

var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

var base = {
  src: {
    app: "./src/app.jsx",
    style: "./src/styles/main.scss",
    scss: "./src/styles/**/*.scss",
    images: "./src/images/**/*",
    views: "./src/views/**/*",
    server: "./src/babel-server.js",
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
  },

  // Paths to load when compiling SCSS
  scssLoadPath: [
    "src/styles",
    "bower_components/foundation/scss"
  ],

  // Directories to output compilied/minified/uglified assets
  dist: {
    root: "./dist",
    css: "./dist/css",
    js: "./dist/js",
    img: "./dist/img",
    views: "./dist/views"
  },

  manifestFile: "manifest.json",

  // File names for compiled assets
  out: {
    app: "app.js",
    style: "main.css",
    vendor: {
      css: "vendor.css",
      head: "head.js",
      js: "vendor.js"
    }
  }
};

var specific = {
  development: {
    isProd: false
  },
  production: {
    isProd: true
  }
};

module.exports = _.merge(base, specific[env]);
