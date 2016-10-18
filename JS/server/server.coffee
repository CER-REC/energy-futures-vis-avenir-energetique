express = require 'express'
path = require 'path'
phantomjs = require 'phantomjs-prebuilt'
webdriverio = require 'webdriverio'
d3 = require 'd3'
jsdom = require 'jsdom'
fs = require 'fs'
path = require 'path'
url = require 'url'
queryString = require 'query-string'


Platform = require '../Platform.coffee'
Platform.name = "server"

ApplicationRoot = require '../../ApplicationRoot.coffee'

ServerApp = require './ServerApp.coffee'
Visualization1 = require '../views/visualization1.coffee'
Visualization2 = require '../views/visualization2.coffee'
Visualization3 = require '../views/visualization3.coffee'
Visualization4 = require '../views/visualization4.coffee'


Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require '../VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require '../VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require '../VisualizationConfigurations/visualization4Configuration.coffee'

PrepareQueryParams = require '../PrepareQueryParams.coffee'




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
  # NB: Page width is set in three locations: 
  # - Here, which determines screenshot size 
  # - in Constants, determines the size of the rendered SVG
  # - in serverSideRenderingStyles.css, which controls page layout

  # Horizontal spacing: 30px wide legend icons with 35px left-right margins, for 100px.
  # 1065px wide graph with 35px right margin, for 1100px. 1200px total.
  webdriverSession.setViewportSize
    width: 1200
    height: 900




  

# Render setup

EnergyConsumptionProvider = require '../DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require '../DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require '../DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require '../DataProviders/ElectricityProductionProvider.coffee'


energyConsumptionProvider = new EnergyConsumptionProvider 
oilProductionProvider = new OilProductionProvider 
gasProductionProvider = new GasProductionProvider 
electricityProductionProvider = new ElectricityProductionProvider

data = fs.readFileSync "#{ApplicationRoot}/public/CSV/crude oil production VIZ.csv"
oilProductionProvider.loadFromString data.toString()

data = fs.readFileSync "#{ApplicationRoot}/public/CSV/Natural gas production VIZ.csv"
gasProductionProvider.loadFromString data.toString()

data = fs.readFileSync "#{ApplicationRoot}/public/CSV/energy demand.csv"
energyConsumptionProvider.loadFromString data.toString()

data = fs.readFileSync "#{ApplicationRoot}/public/CSV/ElectricityGeneration_VIZ.csv"
electricityProductionProvider.loadFromString data.toString()


# TODO: fonts here are auto included. on server, we will always have access to them, but for public consumption we need to parameterize this somehow ... 
ImageHtml = fs.readFileSync("#{ApplicationRoot}/JS/server/image.html").toString()












app = express()


app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.static(path.join(__dirname, '../../../energy-futures-private-resources')))


requestQueue = []
processingRequests = false

processNextRequest = ->
  return if requestQueue.length == 0

  request = requestQueue.shift()

  # Extract the query parameters, and pass them through to the request we will have 
  # Phantom make of our image page building endpoint.
  query = url.parse(request.req.url).search
  session = webdriverSession.url("http://localhost:4747/image/" + query)
  session.then ->

    # We've seen an issue where the font has not loaded in time for the screenshot, and
    # so none of the text is rendered. The 50ms timeout is intended to compensate for this.
    # This is not an ideal solution, but detecting font loading is hard, and this is simple.
    # The issue occurred in maybe 1 request in 20.
    # Other options: include the font as a data URI, try the CSS3 document.fontloader API
    setTimeout ->
      result = session.saveScreenshot()

      result.then (screenshotBuffer) ->
        request.res.setHeader "content-type", "image/png"
        request.res.write(screenshotBuffer)
        request.res.end()

        # result.log('browser').then (messages) ->
        #   messages.value.map (m) -> 
        #     console.log m.message if typeof m.message == 'string'

        if requestQueue.length > 0
          processNextRequest() 
        else
          processingRequests = false

    , 50



app.get '/', (req, res) ->
  console.log "******** enqueuing request"

  requestQueue.push
    req: req
    res: res
    time: Date.now()

  if processingRequests == false
    processingRequests = true
    processNextRequest() 




app.get '/image', (req, res) ->
  
  time = Date.now()

  query = url.parse(req.url).search


  jsdom.env
    features: 
      QuerySelector: true
    html: ImageHtml
    done: (errors, window) -> 

      el = window.document.querySelector('#dataviz-container')
      body = window.document.querySelector('body')
        
      serverApp = new ServerApp window,
        energyConsumptionProvider: energyConsumptionProvider
        oilProductionProvider: oilProductionProvider
        gasProductionProvider: gasProductionProvider
        electricityProductionProvider: electricityProductionProvider
      serverApp.setLanguage req.query.language

      params = PrepareQueryParams queryString.parse(query)


      switch req.query.page
        when 'viz1'
          config = new Visualization1Configuration(serverApp, params)
          viz = new Visualization1(serverApp, config)

        when 'viz2'
          config = new Visualization2Configuration(serverApp, params)
          viz = new Visualization2(serverApp, config)

        when 'viz3'
          config = new Visualization3Configuration(serverApp, params)
          viz = new Visualization3(serverApp, config)

        when 'viz4'
          config = new Visualization4Configuration(serverApp, params)
          viz = new Visualization4(serverApp, config)





      # we need to wait a tick for the zero duration animations to be scheduled and run
      setTimeout ->
        source = window.document.querySelector('html').outerHTML
        res.write source
        res.end()
        console.log "D3 Time: #{Date.now() - time}"




# IIS-Node passes in a handle to listen to in process.env.PORT
app.listen process.env.PORT || 4747
console.log 'Ready.'

