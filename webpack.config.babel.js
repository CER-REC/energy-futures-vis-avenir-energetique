const Path = require('path');
const Webpack = require('webpack');
const sass = require('node-sass');
const SassUtilsConstructor = require('node-sass-utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { features } = require('./src/constants');

const BUILD_DIR = Path.resolve(__dirname, 'public/script');
const sassUtils = SassUtilsConstructor(sass);

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    bundle: './src/index.jsx',
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/conditions/script/',
    filename: '[name].js',
  },
  devtool: devMode ? 'cheap-module-eval-source-map' : 'none',
  module: {
    rules: [
      {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader',
      },

      {
        test: /\.(png|jp(e*)g|svg)$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'url-loader',
          options: { limit: 8000 },
        }],
      },

      {
        test: /\.s?css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                'getFeatureColors($feature)':
                  feature => sassUtils.castToSass(features[feature.getValue()]),
              },
            },
          },
        ],
      },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: { prefix: 'fonts/' },
        },
      },

      {
        test: /\.md$/,
        use: 'raw-loader',
      },

      {
        test: /\.modernizrrc.js$/,
        use: ['modernizr-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      modernizr$: Path.resolve(__dirname, '.modernizrrc.js'),
      'react-spring/renderprops': Path.resolve(__dirname, 'node_modules/react-spring/renderprops.cjs'),
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    devMode ? new Webpack.HotModuleReplacementPlugin() : null,
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
  ].filter(v => !!v),
};
