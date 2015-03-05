"use strict";

var React = require("react");

exports.get = function *() {
  var content = React.renderToString(React.createElement(this.state.reactComponent));
  yield this.render("index", { html: content });
};
