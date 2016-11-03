processImageRequest = require './processImageRequest.coffee'
ImageRequest = require './ImageRequest.coffee'
Logger = require '../Logger.coffee'


rootHandler = (req, res, serverState) ->
  Logger.debug "Enqueuing request"

  serverState.requestQueue.push new ImageRequest
    req: req
    res: res
    time: Date.now()

  if serverState.processingRequests == false
    serverState.processingRequests = true
    processImageRequest serverState 



module.exports = rootHandler
