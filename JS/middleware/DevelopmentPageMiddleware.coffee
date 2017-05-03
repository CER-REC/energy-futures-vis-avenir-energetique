express = require 'express'
path = require 'path'
mustacheExpress = require 'mustache-express'

ApplicationRoot = require '../../ApplicationRoot.coffee'

# Middleware to serve up the web app, for use in development.

DevelopmentPageMiddleware = ->
  app = express()

  # view engine setup
  app.engine 'mustache', mustacheExpress()

  app.set 'views', path.join(ApplicationRoot, 'views')
  app.set 'view engine', 'mustache'

  router = express.Router()

  # Direct the root to the newer template
  router.get '/', (req, res) ->
    res.render 'WET4',
      title: 'WET 4.0.20'

  router.get '/WET3', (req, res) ->
    res.render 'WET3',
      title: 'WET 3.1.12'

  router.get '/WET4', (req, res) ->
    res.render 'WET4',
      title: 'WET 4.0.20'

  router.get '/Wet3VideoIframe', (req, res) ->
    res.render 'Wet3VideoIframe'

  router.get '/Wet4VideoIframe', (req, res) ->
    res.render 'Wet4VideoIframe'
  
  app.use router

  # Turn off caching!
  app.disable 'view cache'

  app


module.exports = DevelopmentPageMiddleware
