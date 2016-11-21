Platform = require '../Platform.coffee'
Platform.name = 'server'
# Array.includes is supported with a command line switch, but for maximum robustness
# we'll continue to use this polyfill.
require '../ArrayIncludes.coffee'

express = require 'express'

Logger = require '../Logger.coffee'



Server = (middlewares) ->
  app = express()

  for middleware in middlewares
    app.use middleware

  app.use (req, res) ->
    res.status(404).send('404: Not Found.')

  # IIS-Node passes in a named pipe to listen to in process.env.PORT
  app.listen process.env.PORT || process.env.PORT_NUMBER
  Logger.info "Ready: #{process.env.HOST}:#{process.env.PORT_NUMBER}"

  app



module.exports = Server
