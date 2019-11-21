V1 = require 'uuid/v1'
BrowserCookies = require 'browser-cookies'

# Constants = require './Constants.coffee'

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


# eventOptions, an object with the following attributes, all strings
#   visualizationMode: Required, the current visualization page. one of:
#     landingPage, viz1, viz2, viz3, viz4, viz5
#   action: Required, the action the user took. one of:
#     click, enter, drag. TODO: this list may be incomplete
#   category: Required, a string for the category of the event
#   action: Optional, a string with more detail about the event

# For details about the possible category/action values, see the drive spreadsheet:
# Energy Futures Analytics Events

  reportEvent: (eventOptions) ->
    return unless @dataLayer?

    unless eventOptions.label?
      eventOptions.label = ''

    window.dataLayer.push
      event: 'energy futures interaction'
      userID: @userUuid
      visualizationMode: eventOptions.visualizationMode
      action: eventOptions.action
      category: eventOptions.category
      label: eventOptions.label







module.exports = AnalyticsReporter
