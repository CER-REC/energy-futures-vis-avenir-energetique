Server = require './Server.coffee'
PublicFilesMiddleware = require '../middleware/PublicFilesMiddleware.coffee'
ImageGenerationMiddleware = require '../middleware/ImageGenerationMiddleware.coffee'
JsonDataMiddleware = require '../middleware/JsonDataMiddleware.coffee'

Server [
  PublicFilesMiddleware()
  JsonDataMiddleware()
  ImageGenerationMiddleware()
]
