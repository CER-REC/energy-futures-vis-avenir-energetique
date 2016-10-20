phantomjs = require 'phantomjs-prebuilt'
webdriverio = require 'webdriverio'
url = require 'url'

 
# Phantom setup

# Start an instance of Phantom, and store a reference to the session. We'll re-use the 
# Phantom instance over the lifetime of the server.

browserTools = 
  phantomPromise: phantomjs.run '--webdriver=4444'
  webdriverSession: null
  
# NB: Before you're tempted to refactor this to use promises throughout, webdriver is NOT
# A+ promise compatible! Trying to use its objects with promises will break in all
# sorts of weird and wonderful ways.
# https://github.com/webdriverio/webdriverio/issues/1431

browserTools.phantomPromise.then => 

  wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }
  browserTools.webdriverSession = webdriverio.remote(wdOpts).init()

  # NB: Page width is set in three locations: 
  # - Here, which determines screenshot size 
  # - in Constants, determines the size of the rendered SVG
  # - in serverSideRenderingStyles.css, which controls page layout

  # Horizontal spacing: 30px wide legend icons with 35px left-right margins, for 100px.
  # 1065px wide graph with 35px right margin, for 1100px. 1200px total.
  browserTools.webdriverSession.setViewportSize
    width: 1200
    height: 900





processImageRequest = (serverState) ->
  if serverState.requestQueue.length == 0
    serverState.processingRequests = false
    return

  imageRequest = serverState.requestQueue.shift()

  imageRequest.handleRequest browserTools, ->
    if serverState.requestQueue.length > 0
      processRequest serverState
    else
      serverState.processingRequests = false





module.exports = processImageRequest



