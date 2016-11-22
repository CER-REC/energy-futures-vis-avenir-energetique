Server = require './Server.coffee'
PublicFilesMiddleware = require '../middleware/PublicFilesMiddleware.coffee'
ImageGenerationMiddleware = require '../middleware/ImageGenerationMiddleware.coffee'
DevelopmentPageMiddleware = require '../middleware/DevelopmentPageMiddleware.coffee'
CSVDataMiddleware = require '../middleware/CSVDataMiddleware.coffee'

Server [
  PublicFilesMiddleware()
  ImageGenerationMiddleware()
  DevelopmentPageMiddleware()
  CSVDataMiddleware()
]
