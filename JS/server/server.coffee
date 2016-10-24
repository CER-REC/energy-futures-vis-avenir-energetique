express = require 'express'
path = require 'path'

Platform = require '../Platform.coffee'
Platform.name = "server"

# TODO: I can't believe I have to include this shim in a node app... what's going on?
require '../ArrayIncludes.coffee'

pngImageHandler = require './pngImageHandler.coffee'
htmlImageHandler = require './htmlImageHandler.coffee'



# TODO: might be more effective to make this a global... rather than inject it?
serverState = 
  requestQueue: []
  processingRequests: false


app = express()

# TODO: Should these use paths derived from ApplicationRoot?
app.use(express.static(path.join(__dirname, '../../public')))
app.use(express.static(path.join(__dirname, '../../../energy-futures-private-resources')))

# Endpoint for PNG generation
app.get '/png_image', (req, res) ->
  pngImageHandler req, res, serverState

# Endpoint for HTML generation, for consumption by Phantom to become the PNG
app.get '/html_image', htmlImageHandler



# IIS-Node passes in a named pipe to listen to in process.env.PORT
app.listen process.env.PORT || 4747
console.log 'Ready.'

