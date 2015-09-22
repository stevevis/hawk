"use strict";

// Dependencies
import koa from "koa";
import path from "path";
import staticCache from "koa-static-cache";
import errorHandler from "koa-error";
import requestLogger from "koa-logger";
import livereload from "koa-livereload";
import responseTime from "koa-response-time";
import koaBody from "koa-body";
import mongoose from "mongoose";

// Local dependencies
import logger from "./config/logger";
import router from "./config/routes/server";
import mongoConfig from "./config/mongo";
import authentication from "./config/authentication";
import render from "./config/render";

// Connect to Mongo
mongoose.connect(mongoConfig.uri, mongoConfig.options);

// Initialize the server
var app = module.exports = koa();
var port = process.env.PORT || 4000;
app.keys = [process.env.HAWK_APP_SECRET];

// Setup development middleware
if (app.env === "development") {
  app.use(livereload());
  app.use(requestLogger());
  // In prod assets are served from CloudFront
  app.use(staticCache(path.join(__dirname, "../dist"), {
    gzip: true
  }));
}

// Setup generic middleware
app.use(responseTime());
app.use(errorHandler());
app.use(koaBody());

// Initialize the data object, this object will be written to the DOM by the view renderer so that the React
// components on the client can use the contents of it to initialize state without AJAX requests.
app.use(function *(next) {
  this.state.data = {};
  yield next;
});

// Setup authentication middleware that will authenticate the user and set the session cookie.
authentication.init(app);

// If there are any errors saved in session, copy them to data to be rendered, then delete them from session.
app.use(function *(next) {
  if (this.session.errors) {
    this.state.data.errors = this.session.errors;
    this.session.errors = false;
  } else {
    this.state.data.errors = {};
  }
  yield next;
});

// Initialize the router that will determine the React component that needs to be rendered and the controller that needs
// to be executed.
router.init(app);

// Initalize the renderer middleware that will render the React component and the data into the view.
render.init(app);

app.listen(port);
logger.info("Server started, listening on port: " + port);
logger.info("Server environment: " + app.env);
