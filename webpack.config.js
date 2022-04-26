const path = require('path');
const copyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  devtool: 'source-map',
  plugins: [
    new copyPlugin({
      patterns: [{from: 'public'}],
    }),
  ],
};
