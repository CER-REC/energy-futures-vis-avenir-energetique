d3 = require 'd3'
chart = require '../../JS/charts/chart.coffee'
barChart = require '../../JS/charts/bar-chart.coffee'

describe "bar chart", ->
  bChart = null
  x = d3.scale.ordinal()
    .domain([0, 100])

  y = d3.scale.linear()
    .domain([0, 100])

  beforeEach( ->
    bChart = new barChart('body', 'classClass', x, y)
  )

  # beforeEach( ->
  #   bChart = new barChart('body', 'classClass', x, y)

  # )

  it "should set the correct defaults", ->
    # expect(bChart instanceof chart).toBeTruthy()  #Check that it is a subclass of chart.. thus defaults etc. already tested
    # expect(bChart.bar_size).toEqual 10
    # expect(bChart._selected_key).toEqual "Canada"

  it "should be possible to get and set the onSelected function", ->
