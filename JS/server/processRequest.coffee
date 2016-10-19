requestQueue = []
processingRequests = false

processNextRequest = ->
  console.log('request')
  return if requestQueue.length == 0

  request = requestQueue.shift()

  # Extract the query parameters, and pass them through to the request we will have 
  # Phantom make of our image page building endpoint.
  query = url.parse(request.req.url).search

  try

    webdriverSession.then ->
    
      webdriverUrlRequest = webdriverSession.url("http://localhost:4747/image/" + query)

      webdriverUrlRequest.then ->

        console.log('after url')

      
        # We've seen an issue where the font has not loaded in time for the screenshot, and
        # so none of the text is rendered. The 50ms timeout is intended to compensate for this.
        # This is not an ideal solution, but detecting font loading is hard, and this is simple.
        # The issue occurred in maybe 1 request in 20.
        # Other options: include the font as a data URI, try the CSS3 document.fontloader API
        setTimeout ->

          try
            buffer = webdriverUrlRequest.saveScreenshot()

            buffer.then (screenshotBuffer) ->
              try            
                request.res.setHeader "content-type", "image/png"
                request.res.write(screenshotBuffer)
                request.res.end()

                # result.log('browser').then (messages) ->
                #   messages.value.map (m) -> 
                #     console.log m.message if typeof m.message == 'string'

                console.log "Time: #{Date.now() - request.time}"

                if requestQueue.length > 0
                  processNextRequest() 
                else
                  processingRequests = false

              catch error
                errorHandler(error, request)

          catch error
            errorHandler(error, request)

        , 50
  catch error
    errorHandler(error, request)


# TODO: Best name ever! fixme ... 
errorHandler = (error, request) ->

  console.error "Error completing request: #{request.req.url}"
  console.error error

  # In the event of an error, we still need to set the server up to process later requests
  if requestQueue.length > 0
    processNextRequest() 
  else
    processingRequests = false
  # TODO: Attempt to respond with the error if the response hasn't been finished?


module.exports = errorHandler



