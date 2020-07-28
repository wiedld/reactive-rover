const path = require('path');

module.exports = {
    ...require('./webpack.config.base.js'),
    entry: {
        app: path.resolve(__dirname, 'src/index.tsx'),
      },
    devServer: {
        contentBase: path.resolve(__dirname, 'lib'),
        compress: true,
        hot: true,
        port: 8080
    },
    devtool: 'inline-source-map',
    mode: 'development',
};
