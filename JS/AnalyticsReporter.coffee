V1 = require 'uuid/v1'
BrowserCookies = require 'browser-cookies'

# Google Tag Manager reporting integration, tailored for the CER.
class AnalyticsReporter

  constructor: (@app) ->
    if @app.window.dataLayer?
      @dataLayer = @app.window.dataLayer

      @userUuid = BrowserCookies.get 'energy-futures-UUID'
      if @userUuid == null
        @userUuid = V1()
        BrowserCookies.set 'energy-futures-UUID', @userUuid

    else
      console.warn 'Google Tag Manager dataLayer not found.'



  # TODO: remove me once we're through
  reportEvent: (eventOptions) ->
    console.log 'got a reportevent'

  # reportPage: (params) ->
  #   return unless @dataLayer?

  #   dataObject = {}

  #   for paramName, param of params
  #     dimensionName = Constants.googleAnalyticsCustomDimensions[paramName]
  #     dataObject[dimensionName] = param

  #   # We want to track the URL without the long string of URL parameters.
  #   location = @app.window.document.location
  #   @dataLayer 'energyFutures.set', 'page', "#{location.protocol}//#{location.host}#{location.pathname}"

  #   @dataLayer 'energyFutures.send', 'pageview', dataObject

  # reportEvent: (category, action) ->
  #   return unless @dataLayer?

  #   @dataLayer 'energyFutures.send',
  #     hitType: 'event'
  #     eventCategory: category
  #     eventAction: action


  # options, an object with the following attributes, all strings
  #   visualizationMode: Required, the current visualization page. one of:
  #     landingPage, viz1, viz2, viz3, viz4, viz5
  #   action: Required, the action the user took. one of:
  #     click, enter, drag. TODO: this list may be incomplete
  #   category: Required, a string for the category of the event
  #   action: Optional, a string with more detail about the event

  # For details about the possible category/action values, see the drive spreadsheet:
  # Energy Futures Analytics Events

  # TODO: rename me to reportEvent once done, using this as a tool to help grep for
  # reportEvent calls not upgraded yet.

  reportedEvent: (options) ->
    return unless @dataLayer?
    unless options.label?
      options.label = ''

    console.log "#{options.label} #{options.action}"

    unless options.visualizationMode
      console.error 'Missing analytics visualizationMode', options
    unless options.action
      console.error 'Missing analytics action', options
    unless options.category
      console.error 'Missing analytics category', options

    window.dataLayer.push
      event: 'energy futures interaction'
      userID: @userUuid
      visualizationMode: options.visualizationMode
      action: options.action
      category: options.category
      label: options.label







module.exports = AnalyticsReporter
