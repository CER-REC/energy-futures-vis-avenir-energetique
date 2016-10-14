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
Visualization2 = require '../views/visualization2.coffee'
Visualization3 = require '../views/visualization3.coffee'
Visualization4 = require '../views/visualization4.coffee'


Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require '../VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require '../VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require '../VisualizationConfigurations/visualization4Configuration.coffee'





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

# TODO: put me in a file and include me!  
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
  

# Render setup

EnergyConsumptionProvider = require '../DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require '../DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require '../DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require '../DataProviders/ElectricityProductionProvider.coffee'


energyConsumptionProvider = new EnergyConsumptionProvider 
oilProductionProvider = new OilProductionProvider 
gasProductionProvider = new GasProductionProvider 
# The electricity production provider requires access to the app object, but only for
# putting string content in popovers. We pass an empty object to avoid crashes.
# TODO: Should we rethink this mechanism? Might be nicer to store language in the config, along with everything else.
electricityProductionProvider = new ElectricityProductionProvider {language: 'en'}

data = fs.readFileSync './public/CSV/crude oil production VIZ.csv'
oilProductionProvider.loadFromString data.toString()

data = fs.readFileSync './public/CSV/Natural gas production VIZ.csv'
gasProductionProvider.loadFromString data.toString()

data = fs.readFileSync './public/CSV/energy demand.csv'
energyConsumptionProvider.loadFromString data.toString()

data = fs.readFileSync './public/CSV/ElectricityGeneration_VIZ.csv'
electricityProductionProvider.loadFromString data.toString()














app = express()


app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.static(path.join(__dirname, '../../../energy-futures-private-resources')))



app.get '/', (req, res) ->
  time = Date.now()
  console.log "******** new request"


  # TODO: add in all the visualization params here
  session = webdriverSession.url('http://localhost:4747/image')
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
      


      serverApp = new ServerApp window,
        energyConsumptionProvider: energyConsumptionProvider
        oilProductionProvider: oilProductionProvider
        gasProductionProvider: gasProductionProvider
        electricityProductionProvider: electricityProductionProvider

      # config = new Visualization1Configuration()
      # viz = new Visualization1(serverApp, config)

      # config = new Visualization2Configuration()
      # viz = new Visualization2(serverApp, config)

      config = new Visualization3Configuration()
      viz = new Visualization3(serverApp, config)



      # we need to wait a tick for the zero duration animations to be scheduled and run
      setTimeout ->
        source = window.document.querySelector('html').outerHTML
        res.write source
        res.end()
        console.log "D3 Time: #{Date.now() - time}"









app.listen 4747
console.log 'Ready.'

