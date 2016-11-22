express = require 'express'

CSVDataHandler = require '../handlers/CSVDataHandler.coffee'

# Middleware for serving visualization data in CSV format

CSVDataMiddleware = ->
  app = express()

  app.get '/csv_data', JsonDataHandler

  app


module.exports = CSVDataMiddleware