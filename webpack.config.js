const path = require('path');
// var webpack = require('webpack')
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
// template: './index.html',
// filename: 'index.html',
// inject: 'body'
// })
module.exports = {
  entry: {
    index: path.join(__dirname, './src/index.js')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './build')
  },
  module: {
   loaders: [
     { test: /\.js$/,
       loader: 'babel-loader',
       exclude: /node_modules/
     },
     {
        test: /\.(c|d|t)sv$/,
        use: ['dsv-loader']
      },
     {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader',
        exclude: /node_modules/,
        include: __dirname
      }
   ]
 }
}
