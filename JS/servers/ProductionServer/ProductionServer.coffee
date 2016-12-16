ApplicationRoot = require '../../../ApplicationRoot.coffee'
path = require 'path'

require('dotenv').config
  path: path.join(ApplicationRoot, 'JS/servers/ProductionServer/.env')

Server = require '../Server.coffee'
ImageGenerationMiddleware = require '../../middleware/ImageGenerationMiddleware.coffee'
JsonDataMiddleware = require '../../middleware/JsonDataMiddleware.coffee'
CSVDataMiddleware = require '../../middleware/CSVDataMiddleware.coffee'
BitlyMiddleware = require '../../middleware/BitlyMiddleware.coffee'

Server [
  JsonDataMiddleware()
  ImageGenerationMiddleware()
  CSVDataMiddleware()
  BitlyMiddleware()
]
