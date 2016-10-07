express = require 'express'
path = require 'path'
phantomjs = require 'phantomjs-prebuilt'
webdriverio = require 'webdriverio'

d3 = require 'd3'
jsdom = require 'jsdom'

htmlStub = '<html><head></head><body><div id="dataviz-container"></div></body></html>' # html file skull with a container div for the d3 dataviz


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
  

  # pass the html stub to jsdom
  jsdom.env
    features: 
      QuerySelector: true
    html: htmlStub
    done: (errors, window) -> 
      # process the html document, like if we were at client side
      # code to generate the dataviz and process the resulting html file to be added here

      el = window.document.querySelector('#dataviz-container')
      body = window.document.querySelector('body')

      d3.select el
        .append 'svg:svg'
          .attr 'width', 600
          .attr 'height', 300
          .append 'circle'
            .attr 'cx', 300
            .attr 'cy', 150
            .attr 'r', 30
            .attr 'fill', '#26963c'

      source = window.document.querySelector('body').innerHTML
      res.write source
      res.end()

  # res.write('erro')
  # res.end()






app.listen 9006

