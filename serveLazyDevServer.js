import express from 'express';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { applicationPath } from './src/constants';
import proxyMiddleware from './.storybook/middleware';
import webpackConfig from './webpack.config.babel';

const PATH = `/${applicationPath.en}/`;
const PORT = 6007;

webpackConfig.plugins.push(new HtmlWebpackPlugin({
  title: applicationPath.en,
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

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Lazy-load Hot-Reload server listening on ${PORT}`);
  console.log(`View at: http://localhost:${6007}${PATH}`);
  /* eslint-enable no-console */
});
