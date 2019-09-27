Platform = require '../Platform.coffee'
Platform.name = 'server'
# Array.includes is supported with a command line switch, but for maximum robustness
# we'll continue to use this polyfill.
require '../Polyfills.coffee'

express = require 'express'

Logger = require '../Logger.coffee'



Server = (middlewares) ->

  rootApp = express()

  if process.env.APP_PATH_PREFIX
    app = express()
    rootApp.use process.env.APP_PATH_PREFIX, app
  else
    app = rootApp

  for middleware in middlewares
    app.use middleware

  app.use (req, res) ->
    res.status(404).send '404: Not Found.'

  # IIS-Node passes in a named pipe to listen to in process.env.PORT
  rootApp.listen process.env.PORT || process.env.PORT_NUMBER, ->

    if process.env.APP_PATH_PREFIX
      Logger.info "Ready: #{process.env.HOST}:#{process.env.PORT_NUMBER}#{process.env.APP_PATH_PREFIX}"
    else
      Logger.info "Ready: #{process.env.HOST}:#{process.env.PORT_NUMBER}"


    rootApp.emit 'server-online'

  rootApp



module.exports = Server
