const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
      oop: './src/oop/app.ts',
      functional: './src/functional/app.ts'
    },
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: '[name].js'
    },
    devServer: {
      contentBase: './lib',
      hot: true
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                "@babel/preset-react",
                '@babel/preset-typescript'
              ],
              plugins: ['@babel/plugin-proposal-object-rest-spread']
            }
          }
        },
        { test: /\.css$/, use: 'css-loader' },
        { test: /\.ts$/, use: 'ts-loader' }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({template: './src/index.html'})
    ],
    mode: 'development'
  }
