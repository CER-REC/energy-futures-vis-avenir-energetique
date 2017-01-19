express = require 'express'

PngImageHandler = require '../handlers/PngImageHandler.coffee'

# Middleware for generating PNG images of visualizations

ImageGenerationMiddleware = ->
  app = express()

  # Endpoint for PNG generation
  app.get '/png_image/*', PngImageHandler


  # Endpoint for serving an image with 1.91:1 aspect ratio, for sharing on social media
  app.get '/social_png', (req, res) ->
    PngImageHandler req, res,
      crop: true

  app


module.exports = ImageGenerationMiddleware