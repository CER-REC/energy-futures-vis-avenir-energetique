const proxy = require('http-proxy-middleware');

module.exports = (router) => {
  // router.use('/conditions/graphql', proxy('http://178.128.239.141'));
  router.use('/energy-future/graphql', proxy('http://localhost'));
};
