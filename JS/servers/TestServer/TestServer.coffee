ApplicationRoot = require '../../../ApplicationRoot.coffee'
path = require 'path'

require('dotenv').config
  path: path.join(ApplicationRoot, 'JS/servers/TestServer/.env')

Server = require '../Server.coffee'
PublicFilesMiddleware = require '../../middleware/PublicFilesMiddleware.coffee'
ImageGenerationMiddleware = require '../../middleware/ImageGenerationMiddleware.coffee'
DevelopmentPageMiddleware = require '../../middleware/DevelopmentPageMiddleware.coffee'
JsonDataMiddleware = require '../../middleware/JsonDataMiddleware.coffee'
CSVDataMiddleware = require '../../middleware/CSVDataMiddleware.coffee'
BitlyMiddleware = require '../../middleware/BitlyMiddleware.coffee'

# Create the server instance, and return it
module.exports = ->
  Server [
    PublicFilesMiddleware()
    ImageGenerationMiddleware()
    JsonDataMiddleware()
    DevelopmentPageMiddleware()
    CSVDataMiddleware()
    BitlyMiddleware()
  ]

