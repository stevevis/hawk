const WebpackConfigFactory = require("./WebpackConfigFactory.js");

module.exports = WebpackConfigFactory.makeConfig({
  prod: true,
  splitCss: true
});
