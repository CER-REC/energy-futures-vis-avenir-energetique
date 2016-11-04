express = require 'express'
path = require 'path'
mustacheExpress = require 'mustache-express'

ApplicationRoot = require '../../ApplicationRoot.coffee'
routes = require '../../routes/index.js'

# Middleware to serve up the web app, for use in development.

DevelopmentPageMiddleware = ->
  app = express()

  # view engine setup
  app.engine 'mustache', mustacheExpress()

  app.set 'views', path.join(ApplicationRoot, 'views')
  app.set 'view engine', 'mustache'

  app.use routes

  # Turn off caching! 
  app.disable("view cache")

  app


module.exports = DevelopmentPageMiddleware
