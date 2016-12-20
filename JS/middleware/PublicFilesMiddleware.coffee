express = require 'express'
path = require 'path'

ApplicationRoot = require '../../ApplicationRoot.coffee'

# Middleware for static file serving: everything in the following directories will be
# served: 
# 'public'
# 'devPublic', for resources that only need to be served in development mode
# the private resources directory

PublicFilesMiddleware = ->
  app = express()

  app.use(express.static(path.join(ApplicationRoot, 'public')))
  app.use(express.static(path.join(ApplicationRoot, 'devPublic')))
  app.use(express.static(path.join(ApplicationRoot, '../energy-futures-private-resources')))

  app


module.exports = PublicFilesMiddleware
