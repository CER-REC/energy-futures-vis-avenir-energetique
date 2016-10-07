express = require 'express'
path = require 'path'
phantomjs = require 'phantomjs-prebuilt'
webdriverio = require 'webdriverio'



wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

# Start an instance of Phantom, and store a reference to the session. We'll re-use the 
# Phantom instance over the lifetime of the server.
webdriverSession = null
phantomjs.run('--webdriver=4444').then (program) => 
  webdriverSession = webdriverio.remote(wdOpts).init()
  webdriverSession.setViewportSize
    width: 1100
    height: 1000

# TODO: Phantom takes up to 5s to start up, and IIS triggers a server restart if the .js
# file has changed when a request comes in. In other words, this is almost guaranteed to
# fail on first request, so we should put the phantom init in a promise... 




app = express()

# app.use(express.static(path.join(__dirname, '../public')))

app.get '/', (req, res) ->
  time = Date.now()
  console.log "******** new request"

  # liek this:
  # direct phantom to load a certain page
  # on the page handler, use d3 w. jsdom to render the SVG and other html structure
  # after it loads up in phantom, screencap it and hand it off.

  # TODO: add in all the visualization params here
  session = webdriverSession.url('http://localhost:9006/image')
  result = session.saveScreenshot()

  result.then (screenshotBuffer) ->
    res.setHeader "content-type", "image/png"
    res.write(screenshotBuffer)
    res.end()
    console.log "Time: #{Date.now() - time}"

    # webdriverSession.log('browser').then (messages) ->
    #   messages.value.map (m) -> 
    #     console.log m.message if typeof m.message == 'string'


app.get '/image', (req, res) ->
  
  res.write('erro')
  res.end()





app.listen 9006

