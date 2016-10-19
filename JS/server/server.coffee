express = require 'express'
phantomjs = require 'phantomjs-prebuilt'
webdriverio = require 'webdriverio'
path = require 'path'

Platform = require '../Platform.coffee'
Platform.name = "server"

# TODO: I can't believe I have to include this shim in a node app... what's going on?
require '../ArrayIncludes.coffee'

imageHandler = require './imageHandler.coffee'


 
# Phantom setup

# Start an instance of Phantom, and store a reference to the session. We'll re-use the 
# Phantom instance over the lifetime of the server.
# TODO: Phantom takes up to 5s to start up, and IIS triggers a server restart if the .js
# file has changed when a request comes in. In other words, this is almost guaranteed to
# fail on first request, so we should put the phantom init in a promise... 

phantomPromise = phantomjs.run '--webdriver=4444'

webdriverSession = null

# NB: Before you're tempted to refactor this to use promises throughout, webdriver is NOT
# A+ promise compatible! Trying to use its objects with promises will break in all
# sorts of weird and wonderful ways.
# https://github.com/webdriverio/webdriverio/issues/1431
webdriverPromise = phantomPromise.then => 
  new Promise (resolve, reject) ->
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

    resolve()


app = express()


app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.static(path.join(__dirname, '../../../energy-futures-private-resources')))




# app.get '/', (req, res) 

app.get '/image', imageHandler



# IIS-Node passes in a handle to listen to in process.env.PORT
app.listen process.env.PORT || 4747
console.log 'Ready.'

