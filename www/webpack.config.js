const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: "./rust-bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "rust-bootstrap.js",
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin(['index.html', 'rust.html', 'js.html', 'js-vector.js', 'js-index.js'])
  ],
};
