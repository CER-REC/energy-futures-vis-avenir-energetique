express = require 'express'

BitlyHandler = require '../handlers/BitlyHandler.coffee'

# Middleware for serving visualization data in JSON format

BitlyMiddleware = ->
  app = express()

  app.get '/bitly_url', BitlyHandler

  app


module.exports = BitlyMiddleware