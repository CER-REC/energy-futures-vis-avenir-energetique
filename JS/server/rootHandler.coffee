processRequest = require './processRequest.coffee'
ImageRequest = require './ImageRequest.coffee'

rootHandler = (req, res, serverState) ->
  console.log "******** enqueuing request"

  serverState.requestQueue.push new ImageRequest
    req: req
    res: res
    time: Date.now()

  if serverState.processingRequests == false
    serverState.processingRequests = true
    processRequest serverState 



module.exports = rootHandler
