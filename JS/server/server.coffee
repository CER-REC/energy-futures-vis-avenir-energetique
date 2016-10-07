express = require 'express'
path = require 'path'
phantomjs = require 'phantomjs-prebuilt'
webdriverio = require 'webdriverio'
d3 = require 'd3'
jsdom = require 'jsdom'


ServerApp = require './ServerApp.coffee'
Visualization1 = require '../views/visualization1.coffee'
Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'



# Phantom setup

wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

# Start an instance of Phantom, and store a reference to the session. We'll re-use the 
# Phantom instance over the lifetime of the server.
# TODO: Phantom takes up to 5s to start up, and IIS triggers a server restart if the .js
# file has changed when a request comes in. In other words, this is almost guaranteed to
# fail on first request, so we should put the phantom init in a promise... 
webdriverSession = null
phantomjs.run('--webdriver=4444').then (program) => 
  webdriverSession = webdriverio.remote(wdOpts).init()
  webdriverSession.setViewportSize
    width: 1100
    height: 1000



# Jsdom Setup

# htmlStub = '<html><head></head><body><div id="dataviz-container"></div></body></html>' # html file skull with a container div for the d3 dataviz


# Render setup

EnergyConsumptionProvider = require '../DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require '../DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require '../DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require '../DataProviders/ElectricityProductionProvider.coffee'


# TODO: This is obivously bad.
loadedCallback = ->
  console.log 'something loaded!'


# TODO: obviously, paramaterize these URLs! 
# TODO: in fact, we should find a way to configure these to not use AJAX at all. No need
# when we can simply pull the CSVs into memory.
energyConsumptionProvider = new EnergyConsumptionProvider loadedCallback, 'http://localhost:3000/CSV/energy demand.csv'
oilProductionProvider = new OilProductionProvider loadedCallback, 'http://localhost:3000/CSV/crude oil production VIZ.csv'
gasProductionProvider = new GasProductionProvider loadedCallback, 'http://localhost:3000/CSV/Natural gas production VIZ.csv'
electricityProductionProvider = new ElectricityProductionProvider loadedCallback, 'http://localhost:3000/CSV/ElectricityGeneration_VIZ.csv'
















app = express()

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

      # To prove out server side rendering of our d3 visualizations, we're only going to 
      # work on viz1 to start.
      # TODO: parameterize all the things! 

      config = new Visualization1Configuration()
      

      serverApp = new ServerApp
        energyConsumptionProvider: energyConsumptionProvider
        oilProductionProvider: oilProductionProvider
        gasProductionProvider: gasProductionProvider
        electricityProductionProvider: electricityProductionProvider



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







app.listen 9006

