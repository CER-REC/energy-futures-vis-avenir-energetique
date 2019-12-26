V1 = require 'uuid/v1'
BrowserCookies = require 'browser-cookies'

Constants = require './Constants.coffee'

# Google Tag Manager reporting integration, tailored for the CER.
class AnalyticsReporter

  constructor: (@app) ->
    if @app.window.dataLayer?
      @dataLayer = @app.window.dataLayer

      @userUuid = BrowserCookies.get 'energy-futures-UUID'
      if @userUuid == null
        @userUuid = V1()
        BrowserCookies.set 'energy-futures-UUID', @userUuid

      # For integration with the page language switch system.
      # language: one of 'en' or 'fr'
      # action: one of 'click' or 'keydown'
      window.reportLanguageEvent = (language, action) =>
        @reportEvent
          category: 'menu'
          action: action
          label: 'langauge'
          value: language

    else
      console.warn 'Google Tag Manager dataLayer not found.'



  # options, an object with the following attributes, all strings

  # category: Required, a string for the category of the event/
  # 'menu' 'media' 'feature - <featuretype>' 'help' 'graph poi'
  # <featuretype> is one of the selector types, for configuring graphs.

  # action: Required, the action the user took.
  # 'click' 'keydown' 'drag'

  # label: Optional, provides more detail.

  # value: Optional, provides more detail.
  # '<subvisualization>' '<footer item>' '<popover text>'

  # subVisualization: Optional, the current visualization page.
  # If this option is not given, we use @app.page.
  # 'landing page' 'by region', 'by sector', 'electricity generation', 'scenarios', 'demand'

  # For details about the possible category/action values, see the drive spreadsheet:
  # Energy Futures Analytics Events

  reportEvent: (options) ->
    return unless @dataLayer?

    # We've decided not to track analytics for back/forward navigation
    return if options.action is 'pageHistory'

    unless options.subVisualization?
      options.subVisualization = Constants.analyticsPageMapping[@app.page]

    # TODO: Delete this
    console.log '*** event'
    console.log "Category: #{options.category}"
    console.log "Action: #{options.action}"
    console.log "Label: #{options.label}"
    console.log "Value: #{options.value}"
    console.log "Subvisualization: #{options.subVisualization}"

    unless options.category
      console.error 'Missing analytics category', options
    unless options.action
      console.error 'Missing analytics action', options

    data =
      event: 'energy future interaction'
      category: options.category
      action: options.action
      userID: @userUuid
      visualization: 'energy future'
      subVisualization: options.subVisualization

    data.label = options.label if options.label?
    data.value = options.value if options.value?

    window.dataLayer.push data






module.exports = AnalyticsReporter
