express = require 'express'

PngImageHandler = require '../handlers/PngImageHandler.coffee'
HtmlImageHandler = require '../handlers/HtmlImageHandler.coffee'

# Middleware for generating PNG images of visualizations

ImageGenerationMiddleware = ->
  app = express()

  # Endpoint for PNG generation
  app.get '/png_image/*', PngImageHandler

  # Endpoint for HTML generation, for consumption by Phantom to become the PNG
  app.get '/html_image', HtmlImageHandler

  app


module.exports = ImageGenerationMiddleware