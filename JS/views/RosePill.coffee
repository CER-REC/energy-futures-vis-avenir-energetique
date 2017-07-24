d3 = require 'd3'
Mustache = require 'mustache'

RosePillTemplate = require '../templates/RosePill.mustache'

class RosePill


  # Options:
  #   data, a single data element as produced by the energy consumption provider
  #   shadowPill, a d3 wrapped DOM node that we will measure to position the pill
  constructor: (@options) ->


  render: ->

    # Measure the shadow pill's position in the DOM
    # rosePillRoot = d3.select '#rosePillRoot'
    rosePillRoot = document.querySelector '#rosePillRoot'
    rootBounds = rosePillRoot.getBoundingClientRect()

    pillBounds = @options.shadowPill[0][0].getBoundingClientRect()

    @left = pillBounds.left - rootBounds.left
    @top = pillBounds.top - rootBounds.top

    # make some pill dom stuff




    # The pill always gets a border matching the source's colour
    classString = "rosePillBox #{@options.data.source}Border"

    # We default the background colour and font colour to white. Depending on whether the
    # value is positive or negative, we set either the background colour or font colour
    # to match the source.
    if Math.round(@options.data.value) >= 0
      classString += " #{@options.data.source}Background"
      changeSymbol = '+'
    else
      classString += " #{@options.data.source}Text"
      # A negative symbol comes from the number being negative
      changeSymbol = ''

    box = Mustache.render RosePillTemplate,
      text: "#{changeSymbol}#{Math.round @options.data.value}%"

    rosePillRoot = d3.select '#rosePillRoot'
    el = rosePillRoot.append 'div'
      .attr
        class: classString
        style: "top: #{@top}px; left: #{@left}px;"


    el[0][0].innerHTML = box
    # position it and fade in (css? d3? probably d3.)


  teardown: ->











module.exports = RosePill