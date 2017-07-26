d3 = require 'd3'
Mustache = require 'mustache'
_ = require 'lodash'

Platform = require '../Platform.coffee'
if Platform.name == 'browser'
  RosePillTemplate = require '../templates/RosePill.mustache'
Constants = require '../Constants.coffee'
PillPopover = require '../popovers/PillPopover.coffee'

defaultOptions =
  clickHandler: ->

class RosePill


  # Options:
  #   data, a single data element as produced by the energy consumption provider
  #   clickHander: a function for when the pill gets a click
  #   rosePillTemplate: function, injected template, only on server
  #   shadowPillBounds, an object with left, top, to locate the shadow pill
  constructor: (@app, options) ->
    @options = _.extend {}, defaultOptions, options
    @document = @app.window.document
    @d3document = d3.select @document

    @popover = new PillPopover @app,
      data: @options.data
      # Can't supply pillCentrePoint at creation time, we do it on update

    @tornDown = false



  render: (options={wait: 0}) ->

    if options.wait > 0
      @app.window.setTimeout =>
        return if @tornDown
        @rosePillBox = @d3document.select('#rosePillRoot').append 'div'
        @update()
      , options.wait
    else
      @rosePillBox = @d3document.select('#rosePillRoot').append 'div'
      @update()


  update: ->
    # Measure the shadow pill's position in the DOM
    rootBounds = @document.querySelector('#rosePillRoot').getBoundingClientRect()

    # TODO: put these pill measurements in constants
    # TODO: document that they should be kept in sync with pill sizes in CSS
    @left = @options.shadowPillBounds.left - rootBounds.left - 35 + @app.pagePadding
    @top = @options.shadowPillBounds.top - rootBounds.top - 13.5 + @app.pagePadding

    # The pill always gets a border matching the source's colour
    classString = "rosePillBox pointerCursor fadein #{@options.data.source}Border"

    # We default the background colour and font colour to white in the CSS for
    # .rosePillBox. Depending on whether the value is positive or negative, we set either
    # the background colour or font colour to match the source.
    if Math.round(@options.data.value) >= 0
      classString += " #{@options.data.source}Background"
      changeSymbol = '+'
    else
      classString += " #{@options.data.source}Text"
      # A negative symbol is provided when we stringify a negative value
      changeSymbol = ''

    switch Platform.name
      when 'browser'
        template = RosePillTemplate
      when 'server'
        template = @options.rosePillTemplate

    pillHtml = Mustache.render template,
      text: "#{changeSymbol}#{Math.round @options.data.value}%"
      image: Constants.viz5RoseData[@options.data.source].image
    @rosePillBox.attr
      class: classString
      style: "top: #{@top}px; left: #{@left}px;"
    .html pillHtml

    @rosePillBox.on 'click', =>
      @options.clickHandler @

    # In addition, update the popover
    @popover.setData @options.data
    @popover.setPillCentrePoint
      left: @options.shadowPillBounds.left - rootBounds.left + @app.pagePadding
      top: @options.shadowPillBounds.top - rootBounds.top + @app.pagePadding



  teardown: ->
    @tornDown = true

    @rosePillBox
      .classed 'fadein', false
      .classed 'fadeout', true

    @app.window.setTimeout =>
      @rosePillBox.remove()
    , 300 # to match duration of pills animate in in CSS. TODO: constants me.






  setData: (data) ->
    @options.data = data if data?

  setShadowPillBounds: (bounds) ->
    @options.shadowPillBounds = bounds if bounds?




module.exports = RosePill