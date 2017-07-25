d3 = require 'd3'
Mustache = require 'mustache'
_ = require 'lodash'

RosePillTemplate = require '../templates/RosePill.mustache'
Constants = require '../Constants.coffee'
PillPopover = require '../popovers/PillPopover.coffee'

defaultOptions =
  clickHandler: ->

class RosePill


  # Options:
  #   data, a single data element as produced by the energy consumption provider
  #   shadowPill, a d3 wrapped DOM node that we will measure to position the pill
  #   clickHander: a function for when the pill gets a click
  constructor: (@app, options) ->
    @options = _.extend {}, defaultOptions, options

    @popover = new PillPopover @app,
      data: @options.data
      # Can't supply pillCentrePoint at creation time, we do it on update




  render: ->
    @rosePillBox = d3.select('#rosePillRoot').append 'div'
    @update()

  update: ->
    # Measure the shadow pill's position in the DOM
    rootBounds = document.querySelector('#rosePillRoot').getBoundingClientRect()
    pillBounds = @options.shadowPill[0][0].getBoundingClientRect()

    # TODO: put these pill measurements in constants
    # TODO: document that they should be kept in sync with pill sizes in CSS
    @left = pillBounds.left - rootBounds.left - 35 + Constants.pagePadding
    @top = pillBounds.top - rootBounds.top - 13.5 + Constants.pagePadding

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

    pillHtml = Mustache.render RosePillTemplate,
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
      left: pillBounds.left - rootBounds.left + Constants.pagePadding
      top: pillBounds.top - rootBounds.top + Constants.pagePadding



  teardown: ->
    @rosePillBox
      .classed 'fadein', false
      .classed 'fadeout', true

    window.setTimeout =>
      @rosePillBox.remove()
    , @app.animationDuration






  setData: (data) ->
    @options.data = data if data?






module.exports = RosePill