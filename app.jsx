"use strict";

var React = window.React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var HawkApp = require("./components/HawkApp.jsx");
var Feed = require("./components/Feed.jsx");
var Track = require("./components/Track.jsx");

$(document).foundation();

var routes = (
  <Route name="hawk" path="/" handler={HawkApp}>
    <Route name="feed" handler={Feed}/>
    <Route name="track" handler={Track}/>
    <DefaultRoute handler={Track}/>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler/>, document.getElementById("hawk-app"));
});
