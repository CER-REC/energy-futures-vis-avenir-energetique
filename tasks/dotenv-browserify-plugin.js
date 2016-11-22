/* 
We want to make the environment settings in .env available in the compiled bundle.
Requiring dotenv and calling config in this plugin loads the .env settings into the
Browserify process, which envify will then find and use to replace process.env.FOO 
instances throughout the bundle.
*/
require('coffee-script').register();
var ApplicationRoot = require('../ApplicationRoot.coffee');
var path = require('path');

require('dotenv').config({
  path: path.join(ApplicationRoot, 'JS/servers/ProductionServer/.env')
})

module.exports = function(){};
