express = require 'express'
path = require 'path'


# NB: The working directory will be the project root when the 'start-image-server' command
# in package.json is run, but it will be JS/server when the app is run under IIS-Node.
# The config module loads files from a folder named config in the working directory.
# So, we change the working directory to be the one this file is in.
# We need to do this *before* we require the config module for the first time!
process.chdir __dirname
config = require 'config'


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
