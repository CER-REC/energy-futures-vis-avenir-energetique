express = require 'express'

BitlyHandler = require '../handlers/BitlyHandler.coffee'

# Middleware for requesting a shortened URL from bitly, serverside

BitlyMiddleware = ->
  app = express()

  app.get '/bitly_url', BitlyHandler

  app


module.exports = BitlyMiddleware