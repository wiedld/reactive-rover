const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const babelPresets = [
  '@babel/preset-env',
  "@babel/preset-react",
];

const babelPlugins = [
  ['@babel/plugin-proposal-class-properties', { allowNamespaces: true }],
  '@babel/plugin-proposal-object-rest-spread',
  // '@babel/plugin-proposal-decorators',
  '@babel/plugin-syntax-dynamic-import'
];

module.exports = {
    entry: {
      app: path.resolve(__dirname, 'src/index.tsx')
    },
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: '[name].js',
      chunkFilename: '[chunkhash].js'
    },
    module: {
      rules: [
        {
          test: /\.js(x?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: babelPresets,
              plugins: babelPlugins.concat([
                '@babel/plugin-transform-runtime'
              ]),
            }
          }
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: babelPresets.concat([
                ['@babel/preset-typescript', { isTSX:true, allExtensions: true }]
              ]),
              plugins: babelPlugins.concat([
                '@babel/plugin-transform-typescript'
              ]),
            }
          }
        },
        { test: /\.css$/, use: 'css-loader' },
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public/index.html') })
    ],
    mode: 'production',
    resolve: {
      extensions: ['.ts', '.tsx', '.json', '.js'],
      alias: {
        react: path.resolve(__dirname, 'node_modules/react')
      }
    }
  }
