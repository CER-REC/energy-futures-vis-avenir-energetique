express = require 'express'

PngImageHandler = require '../imageServer/PngImageHandler.coffee'
HtmlImageHandler = require '../imageServer/HtmlImageHandler.coffee'

# Middlware for generating PNG images of visualizations

ImageGenerationMiddleware = ->
  app = express()

  # Endpoint for PNG generation
  app.get '/png_image/*', PngImageHandler

  # Endpoint for HTML generation, for consumption by Phantom to become the PNG
  app.get '/html_image', HtmlImageHandler

  app


module.exports = ImageGenerationMiddleware