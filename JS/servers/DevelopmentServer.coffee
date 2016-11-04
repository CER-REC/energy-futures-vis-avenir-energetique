# NB: The working directory will be the project root when the 'start' command
# in package.json is run, but it will be JS/server when the app is run under IIS-Node.
# The dotenv module loads the .env file in the working directory.
# So, we change the working directory to be the app root.
# We need to do this *before* we require dotenv!
ApplicationRoot = require '../../ApplicationRoot.coffee'
process.chdir ApplicationRoot
require('dotenv').config()

Platform = require '../Platform.coffee'
Platform.name = 'server'
# Array.includes is supported with a command line switch, but for maximum robustness
# we'll continue to use this polyfill.
require '../ArrayIncludes.coffee'


express = require 'express'

Logger = require '../Logger.coffee'
PublicFilesMiddleware = require '../middleware/PublicFilesMiddleware'
ImageGenerationMiddleware = require '../middleware/ImageGenerationMiddleware'
DevelopmentPageMiddleware = require '../middleware/DevelopmentPageMiddleware'


app = express()

app.use PublicFilesMiddleware()
app.use ImageGenerationMiddleware()
app.use DevelopmentPageMiddleware()

app.use (req, res) ->
  res.status(404).send('404: Not Found.')

# IIS-Node passes in a named pipe to listen to in process.env.PORT
app.listen process.env.PORT || process.env.PORT_NUMBER
Logger.info "Ready: #{process.env.HOST}:#{process.env.PORT_NUMBER}"
