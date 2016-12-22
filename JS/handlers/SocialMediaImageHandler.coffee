fs = require 'fs'
url = require 'url'
Request = require 'request'
PngCrop = require 'png-crop'

Logger = require '../Logger.coffee'


requestCounter = 0


# The default png-crop behaviour is to crop from the top left corner.
# Social media sites tend to crop out the top and bottom of images, but our graph
# images look best if cropped from the top down so that the title remains visible.

config =
  width: 1200
  height: 630

module.exports = (req, res) ->

  requestCounter += 1
  counter = requestCounter
  time = Date.now()

  query = url.parse(req.url).search

  requestOptions = 
    uri: "#{process.env.HOST}:#{process.env.PORT_NUMBER}#{process.env.APP_PATH_PREFIX}/png_image/image.png#{query}"
    encoding: null

  # NB: request-promise is not recommended for streaming
  Request requestOptions, (error, incomingMessage, responseBuffer) ->
    if error
      errorHandler res, req, error, counter
      return

    PngCrop.cropToStream responseBuffer, config, (error, outputStream) ->
      if error
        errorHandler res, req, error, counter
        return
      
      res.setHeader "content-type", "image/png"
      outputStream.pipe res

      Logger.debug "social_png (request S#{counter}) Time: #{Date.now() - time}"
  

errorHandler = (res, req, error, counter) ->
  Logger.error "social_png (request S#{counter}) error: #{error.message}"
  Logger.error error.stack

  res.writeHead 500
  res.end "HTTP 500 #{error.message}"

