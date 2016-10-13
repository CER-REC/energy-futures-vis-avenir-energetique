express = require 'express'
path = require 'path'
phantomjs = require 'phantomjs-prebuilt'
webdriverio = require 'webdriverio'
d3 = require 'd3'
jsdom = require 'jsdom'
fs = require 'fs'
path = require 'path'


Platform = require '../Platform.coffee'
Platform.name = "server"

ServerApp = require './ServerApp.coffee'
Visualization1 = require '../views/visualization1.coffee'
Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'





# TODO: I can't believe I have to include this shim in a node app... what's going on?
require '../ArrayIncludes.coffee'



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

# TODO: include me! 
# TODO: fonts here are auto included. on server, we will always have access to them, but for public consumption we need to parameterize this somehow ... 

htmlStub = """
<!DOCTYPE html>
  <meta charset="utf-8" />

  <link rel="stylesheet" href="CSS/serverSideRenderingStyles.css">
  <link rel="stylesheet" href="CSS/avenirFonts.css">



<div id="canadasEnergyFutureVisualization"> 

  <nav id="vizNavbar">
  </nav>

  <div role="heading" id='landingPageHeading' class='hidden'></div>
  <div class="clearfix"> </div>

  <div id="mainPanel">

    <div id="aboutModal" class="vizModal hidden"> </div>
    <div id="imageDownloadModal" class="vizModal hidden"> </div>

    <div id="visualizationContent"> </div>

    <!-- Both landingPagePanel and bottomNavBar contents are laid out with floats, so
          this clearfix element is necessary to keep them from interfering with each other. -->

    <div class="clearfix"> </div>

  </div>



  <nav id='bottomNavBar' class="hidden"> </nav>




</div>

"""
  
  # <link rel="stylesheet" href="CSS/canadasEnergyFutureVisualization.css">
  # <script type="text/javascript" src="bundle.js"> </script>

# Render setup

EnergyConsumptionProvider = require '../DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require '../DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require '../DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require '../DataProviders/ElectricityProductionProvider.coffee'


energyConsumptionProvider = new EnergyConsumptionProvider # this requires an @app... 
oilProductionProvider = new OilProductionProvider 
gasProductionProvider = new GasProductionProvider 
electricityProductionProvider = new ElectricityProductionProvider

# TODO: arrange some mechanism of waiting on these to complete reading. Promises, probably.

fs.readFile './public/CSV/crude oil production VIZ.csv', (err, data) ->
  throw err if err 
  console.log 'oil done'
  oilProductionProvider.loadFromString data.toString()

fs.readFile './public/CSV/Natural gas production VIZ.csv', (err, data) ->
  throw err if err 
  console.log 'gas done'
  gasProductionProvider.loadFromString data.toString()

fs.readFile './public/CSV/energy demand.csv', (err, data) ->
  throw err if err 
  console.log 'energy done'
  energyConsumptionProvider.loadFromString data.toString()

fs.readFile './public/CSV/ElectricityGeneration_VIZ.csv', (err, data) ->
  throw err if err 
  console.log 'elec done'
  electricityProductionProvider.loadFromString data.toString()














app = express()


app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.static(path.join(__dirname, '../../../energy-futures-private-resources')))




app.get '/', (req, res) ->
  time = Date.now()
  console.log "******** new request"


  # TODO: add in all the visualization params here
  session = webdriverSession.url('http://localhost:9006/image')
  session.then ->
    result = session.saveScreenshot()

    result.then (screenshotBuffer) ->
      res.setHeader "content-type", "image/png"
      res.write(screenshotBuffer)
      res.end()
      console.log "Time: #{Date.now() - time}"

      result.log('browser').then (messages) ->
        messages.value.map (m) -> 
          console.log m.message if typeof m.message == 'string'

app.get '/image', (req, res) ->
  
  time = Date.now()

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


      serverApp = new ServerApp window,
        energyConsumptionProvider: energyConsumptionProvider
        oilProductionProvider: oilProductionProvider
        gasProductionProvider: gasProductionProvider
        electricityProductionProvider: electricityProductionProvider

      viz1 = new Visualization1(serverApp, config)


      # we need to wait a tick for the zero duration animations to be scheduled and run
      setTimeout ->
        # source = window.document.body.firstChild.outerHTML
        console.log window.document.querySelector('image.forecast').outerHTML
        source = window.document.querySelector('html').outerHTML
        res.write source
        res.end()
        console.log "D3 Time: #{Date.now() - time}"









app.listen 9006

