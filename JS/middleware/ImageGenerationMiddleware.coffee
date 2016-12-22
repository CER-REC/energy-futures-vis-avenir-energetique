express = require 'express'

PngImageHandler = require '../handlers/PngImageHandler.coffee'
HtmlImageHandler = require '../handlers/HtmlImageHandler.coffee'
SocialMediaImageHandler = require '../handlers/SocialMediaImageHandler.coffee'

# Middleware for generating PNG images of visualizations

ImageGenerationMiddleware = ->
  app = express()

  # Endpoint for PNG generation
  app.get '/png_image/*', PngImageHandler

  # Endpoint for HTML generation, for consumption by Phantom to become the PNG
  app.get '/html_image', HtmlImageHandler

  # Endpoint for serving an image with 1.91:1 aspect ratio, for sharing on social media
  # Makes requests requests from /png_image internally
  app.get '/social_png', SocialMediaImageHandler

  app


module.exports = ImageGenerationMiddleware