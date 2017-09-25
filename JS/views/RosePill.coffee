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
  #   size, a string, 'large' or 'small'
  constructor: (@app, options) ->
    @options = _.extend {}, defaultOptions, options
    @document = @app.window.document
    @d3document = d3.select @document

    @popover = new PillPopover @app,
      data: @options.data
      pillSize: Constants.viz5PillSizes[@options.size]
      # Can't supply pillCentrePoint at creation time, we do it on update

    @tornDown = false



  render: (options={wait: 0}) ->

    if options.wait > 0
      @app.window.setTimeout =>
        return if @tornDown
        @rosePillBox = @d3document.select('#rosePillRoot').append 'div'
        @rosePillBorder = @d3document.select('#rosePillRoot').append 'div'
        @update()
      , options.wait
    else
      @rosePillBox = @d3document.select('#rosePillRoot').append 'div'
      @rosePillBorder = @d3document.select('#rosePillRoot').append 'div'
      @update()


  update: ->
    # Measure the shadow pill's position in the DOM
    rootBounds = @document.querySelector('#rosePillRoot').getBoundingClientRect()

    sizes = Constants.viz5PillSizes[@options.size]
    alignmentMargin = Constants.viz5PillAlignmentMargins[@options.size][@options.data.source]
    centrePoint =
      left: @options.shadowPillBounds.left - rootBounds.left + @app.pagePadding + alignmentMargin
      top: @options.shadowPillBounds.top - rootBounds.top + @app.pagePadding

    @left = centrePoint.left - sizes.width / 2
    @top = centrePoint.top - sizes.height / 2

    # The pill always gets a border matching the source's colour
    classString = "rosePillBox pointerCursor fadein #{@options.data.source}Border #{@options.size}"
    borderClassString = "rosePillBorder pointerCursor fadein #{@options.data.source}Border #{@options.size}"

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

    if Math.round(@options.data.value) > -1 && Math.round(@options.data.value) < 1
      changeSymbol = '~'

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

    @rosePillBorder.attr
      class: borderClassString
      style: "top: #{@top - Constants.roseBorderOffset[@options.size]}px; left: #{@left - Constants.roseBorderOffset[@options.size]}px"

    @rosePillBox.on 'click', =>
      @options.clickHandler @

    # In addition, update the popover
    @popover.setData @options.data
    @popover.setPillCentrePoint centrePoint
    @popover.setPillSize sizes


  teardown: ->
    @tornDown = true
    return unless @rosePillBox?

    @rosePillBox
      .classed 'fadein', false
      .classed 'fadeout', true

    @rosePillBorder
      .classed 'fadein', false
      .classed 'fadeout', true

    @app.window.setTimeout =>
      @rosePillBox.remove()
      @rosePillBorder.remove()
    , Constants.viz5PillPopoverDuration






  setData: (data) ->
    @options.data = data if data?

  setShadowPillBounds: (bounds) ->
    @options.shadowPillBounds = bounds if bounds?




module.exports = RosePill