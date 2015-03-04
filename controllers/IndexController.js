"use strict";

var React = require("react");
var HawkApp = require("../components/HawkApp.jsx");

exports.get = function *() {
  var reactHtml = React.renderToString(React.createElement(HawkApp));
  yield this.render("index", { html: reactHtml });
};
