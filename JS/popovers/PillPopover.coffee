_ = require 'lodash'
d3 = require 'd3'
Mustache = require 'mustache'

Platform = require '../Platform.coffee'

if Platform.name == 'browser'
  PillPopoverTemplate = require '../templates/PillPopover.mustache'
Tr = require '../TranslationTable.coffee'
Constants = require '../Constants.coffee'

defaultOptions =
  data: {}
  pillCentrePoint:
    top: 100
    left: 100

class PillPopover

  # options include:
  #   data, a the rose's data item
  #   pillCentrePoint, an object with top and left attributes, identifying the centre of
  #     the shadow pill
  constructor: (@app, options) ->
    @d3document = d3.select @app.window.document

    @options = _.extend {}, defaultOptions, options
    @rosePillRoot = @d3document.select '#rosePillRoot'

  setData: (data) ->
    @options.data = data if data?

  setPillCentrePoint: (pillCentrePoint) ->
    @options.pillCentrePoint = pillCentrePoint if pillCentrePoint?

  setPillSize: (dimensions) ->
    @options.pillSize = pillSize if pillSize?



  # showOptions:
  #   verticalAnchor, 'top' or 'bottom'
  #   horizontalAnchor, 'left' or 'right'
  # The 'anchor' options influence where the popover is placed, above or below the pill
  # and to its left or right.
  show: (showOptions) ->
    # When the orientation is top, the popover is anchored at its bottom to the top of
    # the pill, and so the text requires some extra padding in bottom.
    # Vice versa for when the orientation is bottom.
    switch showOptions.verticalAnchor
      when 'top' then paddingClass = 'pillPopoverPaddingBottom'
      when 'bottom' then paddingClass = 'pillPopoverPaddingTop'
    classString = "pillPopover fadein #{@options.data.source} #{paddingClass}"

    # Half width, to place the popover at the far side of the pill
    # Half height, because that is the width of the border radius
    horizontalOffset = @options.pillSize.width / 2 - @options.pillSize.height / 2

    left = @options.pillCentrePoint.left
    switch showOptions.horizontalAnchor
      when 'left'
        left += horizontalOffset
        left -= Constants.pillPopoverWidth
      when 'right'
        left -= horizontalOffset

    top = @options.pillCentrePoint.top
    if showOptions.verticalAnchor == 'top'
      top -= Constants.pillPopoverHeight

    styleString = "top: #{top}px; left: #{left}px;"

    # This display is based on the assumption that units are petajoules
    data = @options.data
    html = Mustache.render PillPopoverTemplate,
      headingText: Tr.sourceSelector.sources[data.source][@app.language]
      baseDemandText: "#{Math.round data.basePercentage}% #{Tr.viz5Pills.ofDemandIn[@app.language]} #{data.baseYear}"
      baseDemandAmounts: "#{Math.round data.baseValue} PJ / #{Math.round data.baseTotal} PJ"
      comparisonDemandText: "#{Math.round data.comparisonPercentage}% #{Tr.viz5Pills.ofDemandIn[@app.language]} #{data.comparisonYear}"
      comparisonDemandAmounts: "#{Math.round data.comparisonValue} PJ / #{Math.round data.comparisonTotal} PJ"

    @popoverElement = @rosePillRoot.append 'div'
      .attr
        class: classString
        style: styleString
      .html html



  close: ->
    @popoverElement
      .classed 'fadein', false
      .classed 'fadeout', true

    @app.window.setTimeout =>
      @popoverElement.remove()
      @popoverElement = null
    , Constants.viz5PillPopoverDuration


  focus: ->
    headingElement = @popoverElement.select '.pillPopoverHeading'
    # [0][0] escapes the d3 wrapper
    headingElement[0][0].focus()

    # TODO: This popover, unlike all of the others, has no close button.
    # This is a problem for accessibility, unclear what to do about it at this point

  container: ->
    # [0][0] escapes the d3 wrapper
    @popoverElement[0][0]




module.exports = PillPopover
