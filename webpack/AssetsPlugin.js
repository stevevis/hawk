/*
 * This WebPack plugin emits a JSON file that contains the path of each asset that WebPack wrote, as well as the hash
 * that was calculated based on the assets.
 */

const fs = require("fs");
const path = require("path");

function AssetsPlugin(options) {
  this.options = options || {};
}

AssetsPlugin.prototype.apply = function apply(compiler) {
  compiler.plugin("done", (stats, done) => {
    const output = {
      hash: stats.toJson().hash,
      assets: stats.toJson().assetsByChunkName
    };

    fs.writeFileSync(
      path.join(this.options.path, this.options.filename),
      JSON.stringify(output),
      done
    );
  });
};

module.exports = AssetsPlugin;
