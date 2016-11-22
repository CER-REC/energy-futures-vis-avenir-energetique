Server = require './Server.coffee'
PublicFilesMiddleware = require '../middleware/PublicFilesMiddleware.coffee'
ImageGenerationMiddleware = require '../middleware/ImageGenerationMiddleware.coffee'

Server [
  PublicFilesMiddleware()
  ImageGenerationMiddleware()
]
