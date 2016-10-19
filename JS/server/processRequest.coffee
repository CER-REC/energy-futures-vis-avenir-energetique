phantomjs = require 'phantomjs-prebuilt'
webdriverio = require 'webdriverio'
url = require 'url'

 
# Phantom setup

# Start an instance of Phantom, and store a reference to the session. We'll re-use the 
# Phantom instance over the lifetime of the server.

phantomPromise = phantomjs.run '--webdriver=4444'

webdriverSession = null

# NB: Before you're tempted to refactor this to use promises throughout, webdriver is NOT
# A+ promise compatible! Trying to use its objects with promises will break in all
# sorts of weird and wonderful ways.
# https://github.com/webdriverio/webdriverio/issues/1431

phantomPromise.then => 

  wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }
  webdriverSession = webdriverio.remote(wdOpts).init()

  # NB: Page width is set in three locations: 
  # - Here, which determines screenshot size 
  # - in Constants, determines the size of the rendered SVG
  # - in serverSideRenderingStyles.css, which controls page layout

  # Horizontal spacing: 30px wide legend icons with 35px left-right margins, for 100px.
  # 1065px wide graph with 35px right margin, for 1100px. 1200px total.
  webdriverSession.setViewportSize
    width: 1200
    height: 900

# TODO: Handle this case?
# phantomPromise.catch (err) ->
#   console.log err.message





processRequest = (serverState) ->

  return if serverState.requestQueue.length == 0

  request = serverState.requestQueue.shift()

  # Extract the query parameters, and pass them through to the request we will have 
  # Phantom make of our image page building endpoint.
  query = url.parse(request.req.url).search

  try
    webdriverSession.then ->
      webdriverUrlRequest = webdriverSession.url("http://localhost:4747/image/" + query)

      webdriverUrlRequest.then ->

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

                if serverState.requestQueue.length > 0
                  processRequest(serverState) 
                else
                  serverState.processingRequests = false

              catch error
                errorHandler(error, request, serverState)

          catch error
            errorHandler(error, request, serverState)

        , 50
  catch error
    errorHandler(error, request, serverState)


# TODO: Best name ever! fixme ... 
errorHandler = (error, request, serverState) ->

  console.error "Error completing request: #{request.req.url}"
  console.error error

  # In the event of an error, we still need to set the server up to process later requests
  if serverState.requestQueue.length > 0
    processRequest(serverState)
  else
    serverState.processingRequests = false
  # TODO: Attempt to respond with the error if the response hasn't been finished?




module.exports = processRequest



