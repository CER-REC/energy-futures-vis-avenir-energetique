express = require 'express'
path = require 'path'

ApplicationRoot = require '../../ApplicationRoot.coffee'

# Middleware for static file serving: everything in the 'public' directory and in the
# private resources repository will be served.

PublicFilesMiddleware = ->
  app = express()

  app.use(express.static(path.join(ApplicationRoot, 'public')))
  app.use(express.static(path.join(ApplicationRoot, '../energy-futures-private-resources')))

  app


module.exports = PublicFilesMiddleware
