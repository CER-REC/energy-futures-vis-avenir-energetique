express = require 'express'
Compression = require 'compression'

Logger = require '../Logger.coffee'



Server = (middlewares) ->

  rootApp = express()

  if process.env.APP_PATH_PREFIX
    app = express()
    rootApp.use process.env.APP_PATH_PREFIX, app
  else
    app = rootApp

  app.use Compression()

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
