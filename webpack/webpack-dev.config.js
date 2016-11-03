const WebpackConfigFactory = require("./WebpackConfigFactory.js");

module.exports = WebpackConfigFactory.makeConfig({
  hot: true,
  splitCss: false, // hot module reloading doesn't work if the CSS is in a seperate bundle
  devServerHost: "localhost",
  devServerPort: 4000
});
