


rootHandler = ->

  # Ensure webdriver and phantom are ready before use
  console.log '******** received request... '
  webdriverPromise.then ->
    console.log "******** enqueuing request"

    requestQueue.push
      req: req
      res: res
      time: Date.now()

    if processingRequests == false
      processingRequests = true
      processNextRequest() 



module.exports = rootHandler
