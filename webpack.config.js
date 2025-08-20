const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/i,
        type: 'asset',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: false
    })
  ],
  devtool: "eval-source-map",
  devServer: {
    static: './dist',
    port: 5173,
    hot: true
  }
};
