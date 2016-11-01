
config = ->
  # NB: Currently, this includes configuration files for every environment in the bundle
  # If we add sensitive data to the configuration, we will have to do something more
  # sophisticated here to exclude it.
  if process.env.NODE_ENV == 'development'
    JSON.parse require('../config/development.json')
  else if process.env.NODE_ENV == 'production'
    JSON.parse require('../config/production.json')
  else
    throw 'ClientConfig: NODE_ENV not set, no configuration loaded.'


module.exports = config()