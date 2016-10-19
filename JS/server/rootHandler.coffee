processRequest = require './processRequest.coffee'

rootHandler = (req, res, serverState) ->
  console.log "******** enqueuing request"

  serverState.requestQueue.push
    req: req
    res: res
    time: Date.now()

  if serverState.processingRequests == false
    serverState.processingRequests = true
    processRequest serverState 



module.exports = rootHandler
