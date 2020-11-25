const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfig = require('../webpack.config.babel.js');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = ({ config }) => {
  Object.assign(config.module, { rules: webpackConfig.module.rules });
  Object.assign(config.resolve.alias, webpackConfig.resolve.alias);
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
  );
  return config;
};
