fs = require 'fs'
url = require 'url'
# Request = require 'request-promise'
Request = require 'request'
PngCrop = require 'png-crop'

Logger = require '../Logger.coffee'
# Constants = require '../Constants.coffee'


requestCounter = 0



config =
  width: 1200
  height: 630

module.exports = (req, res) ->

  query = url.parse(req.url).search

  # requestOptions = 
  #   simple: false
  #   uri: "#{process.env.HOST}:#{process.env.PORT_NUMBER}#{process.env.APP_PATH_PREFIX}/png_image/image.png#{query}"
  #   encoding: null

  requestOptions = 
    uri: "#{process.env.HOST}:#{process.env.PORT_NUMBER}#{process.env.APP_PATH_PREFIX}/png_image/image.png#{query}"
    encoding: null


  Request requestOptions, (error, incomingMessage, responseBuffer) ->
    throw error if error

    PngCrop.cropToStream responseBuffer, config, (error, outputStream) ->
      # TODO: handle me
      throw error if error
      
      res.setHeader "content-type", "image/png"
      outputStream.pipe res

  


  # Request requestOptions

  # .then (response) ->

  # TODO: promisify ... 


  # .catch (error) ->

  #   Logger.error "social_png (request S#{@counter}) error: #{error.message}"
  #   Logger.error error.stack

  #   @res.writeHead 500
  #   @res.end "HTTP 500 #{error.message}"

