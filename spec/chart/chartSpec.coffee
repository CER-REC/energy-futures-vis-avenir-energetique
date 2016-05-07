d3 = require 'd3'
basicChart = require('../../JS/charts/chart.coffee');

describe "chart", ->
  chart = null

  beforeEach( ->
    chart = new basicChart('body', 'clasclass')
  )

  it 'should set the correct defaults', ->
    expect(chart._data).toEqual []
    expect(chart._parent).toEqual d3.select('body')
    expect(chart._margin).toEqual {top: 20, right: 20, bottom: 30, left: 50}
    expect(chart.position()).toEqual {'x': 0, 'y':  0}
    expect(chart.size()).toEqual {'w': 200, 'h': 300}

  it "should be possible to get and set the parent", ->
    d3.select('body').append('g').attr(
      id: 'testGroup'
    )
    chart.parent('#testGroup')
    expect(chart.parent()).toEqual(d3.select('#testGroup').node())
  

  it "should be possible to get and set the margin", ->
    new_margins = {top: 10, right: 40, bottom: 20, left: 60}
    chart.margin(new_margins)
    expect(chart.margin()).toEqual(new_margins)

  it "should be possible to get and set the size", ->
    size = {w: 400, h:600}
    chart.size(size)
    expect(chart.size()).toEqual(size)

  it "should be possible to get and set the position", ->
    position = {x:60, y:20} 
    chart.position(position)
    expect(chart.position()).toEqual(position)

  it "should be possible to get and set the data", ->
    chart.data([10, 20, 30])
    expect(chart.data()).toEqual([10, 20, 30])



