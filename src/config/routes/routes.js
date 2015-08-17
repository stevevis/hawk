"use strict";

var HawkApp = require("../../components/HawkApp.jsx");
var Home = require("../../components/Home.jsx");
var Feed = require("../../components/Feed.jsx");
var Watch = require("../../components/Watch.jsx");

var API_PREFIX = "api";

/*
 * The master routes list - We use the React components directly because browserify won't include them if we load them
 * dynamically, but we can just store the Koa controllers as strings and load them dynamically since they are only used
 * on the server.
 */
var routes = {

  API_PREFIX: API_PREFIX,

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
        controller: "SignupController",
        secure: false
      }
    ]
  },

  api: {
    path: "/" + API_PREFIX,
    children: [
      {
        name: "artist_search",
        path: "artist/search",
        methods: ["GET"],
        controller: "API/ArtistSearchController",
        secure: true
      },
      {
        name: "user_watching",
        path: "user/:userId/watching/",
        methods: ["GET"],
        controller: "API/UserWatchController",
        secure: true
      },
      {
        name: "user_watch",
        path: "user/:userId/watching/:artistId",
        methods: ["PUT", "DEL"],
        controller: "API/UserWatchController",
        secure: true
      },
      {
        mame: "user_feed",
        path: "user/:userId/feed",
        methods: ["GET"],
        controller: "API/UserFeedController",
        secure: true
      }
    ]
  }
};

module.exports = routes;
