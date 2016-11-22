express = require 'express'

JsonDataHandler = require '../handlers/JsonDataHandler.coffee'

# Middleware for serving visualization data in JSON format

JsonDataMiddleware = ->
  app = express()

  app.get '/json_data', JsonDataHandler

  app


module.exports = JsonDataMiddleware