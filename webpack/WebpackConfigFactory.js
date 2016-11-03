const path = require("path");
const webpack = require("webpack");
const AssetsPlugin = require("./AssetsPlugin.js");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const styleDir = path.join(process.cwd(), "src/style");
const assetsDir = path.join(process.cwd(), "dist/assets");
const nodeModulesDir = path.join(process.cwd(), "node_modules");

const awsConfig = require("../src/config/aws");

/*
 * Helper class to construct webpack config.
 * http://webpack.github.io/docs/configuration.html
 */
class WebpackConfigFactory {
  static entry(options) {
    const entry = {
      app: ["./src/app.jsx"],
      vendor: [
        "react",
        "react-dom",
        "jquery",
        "tether",
        "bootstrap",
        "bootstrap_scss"
      ]
    };

    if (options.hot) {
      entry.app.unshift(
          "webpack/hot/only-dev-server",
          `webpack-dev-server/client?http://${options.devServerHost}:${options.devServerPort}`);
    }

    return entry;
  }

  static output(options) {
    let output = {};

    if (options.prod) {
      output = {
        path: path.join(assetsDir, "[hash]"),
        publicPath: `${awsConfig.CloudFront.URL}/[hash]/`,
        filename: "[name].[hash].js"
      };
    } else {
      output = {
        path: assetsDir,
        publicPath: `http://${options.devServerHost}:${options.devServerPort}/`,
        filename: "[name].js"
      };
    }

    return output;
  }

  static loaders(options) {
    let scssLoaderString = options.prod ? "css!sass?" : "css?sourceMap!sass?sourceMap&";
    scssLoaderString += `precision=10&includePaths[]=${nodeModulesDir}&includePaths[]=${styleDir}`;
    const extractTextPlugin = ExtractTextPlugin.extract("style", scssLoaderString, { publicPath: "./" });

    const scssLoader = {
      test: /\.scss$/,
      loader: options.splitCss ? extractTextPlugin : `style!${scssLoaderString}`
    };

    const jsxLoader = {
      test: /\.jsx?$/,
      loader: "babel",
      exclude: /node_modules/
    };

    const imageName = options.prod ? "images/[name].[hash].[ext]" : "images/[name].[ext]";
    const imgLoader = {
      test: /\.(png|jpe?g|gif)$/i,
      loader: `file-loader?name=${imageName}`
    };

    return [
      scssLoader,
      jsxLoader,
      imgLoader
    ];
  }

  static plugins(options) {
    const plugins = [
      new webpack.optimize.CommonsChunkPlugin("vendor", options.prod ? "vendor.[hash].js" : "vendor.js"),

      new webpack.ProvidePlugin({
        jQuery: "jquery",
        "window.Tether": "tether"
      })
    ];

    if (options.hot) {
      plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin());
    }

    if (options.splitCss) {
      plugins.push(new ExtractTextPlugin(options.prod ? "[name].[hash].css" : "[name].css", { allChunks: true }));
    }

    if (options.prod) {
      plugins.push(
        new AssetsPlugin({
          path: assetsDir,
          filename: "assets.json"
        }),
        new webpack.DefinePlugin({
          "process.env": {
            // This has effect on the react lib size
            "NODE_ENV": JSON.stringify("production")
          }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false
          }
        })
      );
    }

    return plugins;
  }

  static resolveAlias() {
    return {
      "bootstrap_scss": `${styleDir}/_bootstrap-custom.scss`
    };
  }

  static resolve() {
    return {
      alias: WebpackConfigFactory.resolveAlias(),
      extensions: ["", ".js", ".jsx", ".scss"],
      moduleDirectories: ["src", "config", "node_modules"]
    };
  }

  static debug(options) {
    return !options.prod;
  }

  static devtool(options) {
    return options.prod ? "" : "eval";
  }

  static devServer(options) {
    return {
      host: options.devServerHost,
      port: options.devServerPort,
      hot: options.hot,
      stats: {
        chunks: false,
        colors: true
      }
    };
  }

  static makeConfig(options) {
    return {
      entry: WebpackConfigFactory.entry(options),
      output: WebpackConfigFactory.output(options),
      module: {
        loaders: WebpackConfigFactory.loaders(options)
      },
      plugins: WebpackConfigFactory.plugins(options),
      debug: WebpackConfigFactory.debug(options),
      devtool: WebpackConfigFactory.devtool(options),
      resolve: WebpackConfigFactory.resolve(),
      devServer: WebpackConfigFactory.devServer(options)
    };
  }
}

module.exports = WebpackConfigFactory;
