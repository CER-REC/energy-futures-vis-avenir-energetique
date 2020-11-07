import express from 'express';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import proxyMiddleware from './.storybook/middleware';
import webpackConfig from './webpack.config.babel';

const PATH = '/energy-future/';
// const PATH = '/avenir-energetique/';

webpackConfig.plugins.push(new HtmlWebpackPlugin({
  template: '.serveLazyDevServerTemplate.html',
}));
webpackConfig.output.publicPath = PATH;

const compiler = webpack(webpackConfig);
const app = express();

app.use(middleware(compiler, {
  host: '0.0.0.0',
  publicPath: PATH,
}));
app.use(PATH, express.static('.storybook/wet-template'));
proxyMiddleware(app);

// eslint-disable-next-line no-console
app.listen(6007, () => console.log('Lazy-load Hot-Reload server listening on 6007'));
