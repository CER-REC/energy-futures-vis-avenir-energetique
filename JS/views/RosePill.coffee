d3 = require 'd3'
Mustache = require 'mustache'

RosePillTemplate = require '../templates/RosePill.mustache'
Constants = require '../Constants.coffee'

class RosePill


  # Options:
  #   data, a single data element as produced by the energy consumption provider
  #   shadowPill, a d3 wrapped DOM node that we will measure to position the pill
  constructor: (@app, @options) ->


  render: ->
    @rosePillBox = d3.select('#rosePillRoot').append 'div'
    @update()

  update: ->
    # Measure the shadow pill's position in the DOM
    rootBounds = document.querySelector('#rosePillRoot').getBoundingClientRect()
    pillBounds = @options.shadowPill[0][0].getBoundingClientRect()

    @left = pillBounds.left - rootBounds.left - 35 + Constants.pagePadding
    @top = pillBounds.top - rootBounds.top - 13.5 + Constants.pagePadding

    # The pill always gets a border matching the source's colour
    classString = "rosePillBox fadein #{@options.data.source}Border"

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

    # TODO position it and fade in (css? d3? probably d3.)




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