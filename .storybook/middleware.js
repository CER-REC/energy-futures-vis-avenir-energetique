const proxy = require('http-proxy-middleware');
require('dotenv').config();

module.exports = (router) => {
  router.use('/energy-future/graphql', proxy(process.env.MIDDLEWARE_PROXY_ADDRESS));
};
