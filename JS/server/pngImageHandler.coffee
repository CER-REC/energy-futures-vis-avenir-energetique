url = require 'url'

processImageRequest = require './processImageRequest.coffee'
ImageRequest = require './ImageRequest.coffee'
Logger = require '../Logger.coffee'


serverState = 
  requestQueue: []
  processingRequests: false

request_counter = 0

rootHandler = (req, res) ->
  request_counter++

  Logger.info "png_image (request P#{request_counter}): #{url.parse(req.url).search}"


  serverState.requestQueue.push new ImageRequest
    req: req
    res: res
    time: Date.now()
    counter: request_counter

  if serverState.processingRequests == false
    serverState.processingRequests = true
    processImageRequest serverState 



module.exports = rootHandler
