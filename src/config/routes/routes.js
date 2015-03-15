"use strict";

var HawkApp = require("../../components/HawkApp.jsx");
var Home = require("../../components/Home.jsx");
var Feed = require("../../components/Feed.jsx");
var Watch = require("../../components/Watch.jsx");

/* 
 * The master routes list - We use the React components directly because browserify won't include them if we load them
 * dynamically, but we can just store the Koa controllers as strings and load them dynamically since they are only used
 * on the server.
 */
var routes = {

  app: {
    name: "hawk",
    path: "/",
    methods: ["GET"],
    handler: HawkApp,
    controller: "IndexController",
    children: [
      {
        name: "home",
        path: "home",
        methods: ["GET"],
        handler: Home,
        controller: "IndexController",
        defaultRoute: true
      },
      {
        name: "feed",
        path: "feed",
        methods: ["GET"],
        handler: Feed,
        controller: "IndexController",
        secure: true
      },
      {
        name: "track",
        path: "watch",
        methods: ["GET"],
        handler: Watch,
        controller: "IndexController",
        secure: true
      }
    ]
  },

  action: {
    path: "/",
    children: [
      {
        name: "login",
        path: "login",
        methods: ["POST"],
        controller: "LoginController",
        secure: false
      },
      {
        name: "logout",
        path: "logout",
        methods: ["GET"],
        controller: "LogoutController",
        secure: true
      },
      {
        name: "signup",
        path: "signup",
        methods: ["POST"],
        controller: "UserController",
        secure: false
      }
    ]
  },

  api: {
    path: "/api",
    children: [
      {
        name: "artist",
        path: "artist",
        methods: ["GET"],
        controller: "ArtistController",
        secure: true
      },
      {
        name: "watch",
        path: "user/:userId/feed/:artistId",
        methods: ["PUT", "DEL"],
        controller: "FeedController",
        secure: true
      },
      {
        mame: "feed",
        path: "user/:userId/feed",
        methods: ["GET"],
        controller: "FeedController",
        secure: true
      }
    ]
  }
};

module.exports = routes;
