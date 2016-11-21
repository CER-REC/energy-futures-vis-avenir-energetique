# NB: The working directory will be the project root when a server command
# in package.json is run, but it will be JS/server when the app is run under IIS-Node.
# The dotenv module loads the .env file in the working directory.
# So, we change the working directory to be the server's directory
# We need to do this *before* we require dotenv!

process.chdir __dirname
require('dotenv').config()

Server = require '../Server.coffee'
PublicFilesMiddleware = require '../../middleware/PublicFilesMiddleware.coffee'
ImageGenerationMiddleware = require '../../middleware/ImageGenerationMiddleware.coffee'
DevelopmentPageMiddleware = require '../../middleware/DevelopmentPageMiddleware.coffee'
JsonDataMiddleware = require '../../middleware/JsonDataMiddleware.coffee'

Server [
  PublicFilesMiddleware()
  ImageGenerationMiddleware()
  JsonDataMiddleware()
  DevelopmentPageMiddleware()
]
