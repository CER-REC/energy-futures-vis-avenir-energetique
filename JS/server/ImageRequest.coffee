url = require 'url'




class ImageRequest

  constructor: (@options) ->
    @req = @options.req
    @res = @options.res
    @time = @options.time || Date.now()

    # Extract the query parameters, and pass them through to the request we will have 
    # Phantom make of our image page building endpoint.
    @query = url.parse(@req.url).search

    @webdriverUrlRequest = null
    @webdriverScreenshotRequest = null




  loadUrl: (webdriverSession) ->
    @webdriverSession = webdriverSession

    @webdriverUrlRequest = @webdriverSession.url("http://localhost:4747/image/#{@query}")

    @webdriverUrlRequest.then =>

      # We've seen an issue where the font has not loaded in time for the screenshot, and
      # so none of the text is rendered. The 50ms timeout is intended to compensate for this.
      # This is not an ideal solution, but detecting font loading is hard, and this is simple.
      # The issue occurred in maybe 1 request in 20.
      # Other options: include the font as a data URI, try the CSS3 document.fontloader API
      setTimeout @saveScreenshot, 50




  saveScreenshot: =>
    @webdriverScreenshotRequest = @webdriverUrlRequest.saveScreenshot()
    @webdriverScreenshotRequest.then @writeResponse


  writeResponse: (screenshotBuffer) =>
    @res.setHeader "content-type", "image/png"
    @res.write(screenshotBuffer)
    @res.end()

    console.log "Time: #{Date.now() - @time}"











module.exports = ImageRequest