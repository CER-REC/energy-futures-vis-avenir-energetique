Server = require './Server.coffee'
PublicFilesMiddleware = require '../middleware/PublicFilesMiddleware.coffee'
ImageGenerationMiddleware = require '../middleware/ImageGenerationMiddleware.coffee'
DevelopmentPageMiddleware = require '../middleware/DevelopmentPageMiddleware.coffee'
JsonDataMiddleware = require '../middleware/JsonDataMiddleware.coffee'

Server [
  PublicFilesMiddleware()
  # ImageGenerationMiddleware()
  JsonDataMiddleware()
  DevelopmentPageMiddleware()
]
