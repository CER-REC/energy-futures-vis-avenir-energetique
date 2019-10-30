ApplicationRoot = require '../../../ApplicationRoot.coffee'
path = require 'path'

require('dotenv').config
  path: path.join(ApplicationRoot, 'JS/servers/DevelopmentServer/.env')

Server = require '../Server.coffee'
PublicFilesMiddleware = require '../../middleware/PublicFilesMiddleware.coffee'
DevelopmentPageMiddleware = require '../../middleware/DevelopmentPageMiddleware.coffee'
JsonDataMiddleware = require '../../middleware/JsonDataMiddleware.coffee'
CSVDataMiddleware = require '../../middleware/CSVDataMiddleware.coffee'
BitlyMiddleware = require '../../middleware/BitlyMiddleware.coffee'

Server [
  PublicFilesMiddleware()
  JsonDataMiddleware()
  DevelopmentPageMiddleware()
  CSVDataMiddleware()
  BitlyMiddleware()
]
