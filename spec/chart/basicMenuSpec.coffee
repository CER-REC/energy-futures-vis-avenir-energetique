chart = require '../../JS/charts/chart.coffee'
basicMenu = require '../../JS/charts/basic-menu.coffee'

describe "basic menu", ->
  menu = null

  beforeEach( ->
    menu = new basicMenu('body', 'classClass')
  )

  it "should set the correct defaults", ->
    expect(menu instanceof chart).toBeTruthy()  #Check that it is a subclass of chart.. thus defaults etc. already tested
    expect(menu._selected_menu_index).toEqual -1
    expect(menu._selected_key).toEqual "Canada"

  it "should be possible to get and set the onSelected function", ->
    testSel = ->
    menu.on_selected(testSel)
    expect(menu.on_selected()).toEqual testSel

  it 'should be possible to get and set the selection', ->
    menu.selection('google')
    expect(menu.selection()).toEqual "google"
    