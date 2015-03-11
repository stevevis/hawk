"use strict";

var path = require("path");
var koaViews = require("koa-views");
var React = require("react");
var logger = require("../config/logger");

exports.init = function(app) {
  app.use(koaViews(path.join(__dirname, "../../dist/views"), {
    map: {
      html: "handlebars"
    }
  }));

  // This function basically takes credit for all the hard work done by the router and the controller. It gets the React
  // component that needs to be rendered out of ctx.state.reactComponent (set by the React Router) and renders it with
  // the props from ctx.state.props (set by the Koa Controller). It then injects the React markup into the view template
  // in this.state.view (also set by the Koa Controller) and renders it to the client.
  app.use(function *() {
    // If the view isn't set, or the request method isn't GET, we shouldn't be here...
    if (!this.state.view || this.method !== "GET") {
      logger.warn("Render function called with no view or invalid method: method=%s, path=%s", this.method, this.path);
      return this.redirect("/");
    }

    var content = React.renderToString(React.createElement(this.state.reactComponent, this.state.props));
    yield this.render(this.state.view, { html: content, props: JSON.stringify(this.state.props) });
  });
};
