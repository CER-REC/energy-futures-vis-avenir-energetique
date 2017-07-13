d3 = require 'd3'
Mustache = require 'mustache'

Constants = require '../Constants.coffee'
# SquareMenu = require '../charts/SquareMenu.coffee'
# Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'

# ParamsToUrlString = require '../ParamsToUrlString.coffee'
# CommonControls = require './CommonControls.coffee'

if Platform.name == 'browser'
  Visualization5Template = require '../templates/Visualization5.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

# ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'

# ProvinceAriaText = require '../ProvinceAriaText.coffee'








class Visualization5


  renderBrowserTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render Visualization5Template,
      # selectDatasetLabel: Tr.datasetSelector.selectDatasetLabel[@app.language]
      # selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
      # selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
      svgStylesheet: SvgStylesheetTemplate

      # altText:
      #   datasetsHelp: Tr.altText.datasetsHelp[@app.language]
      #   scenariosHelp: Tr.altText.scenariosHelp[@app.language]



  constructor: (@app, config, @options) ->
    @config = config
    @outerHeight = 700
    @margin =
      top: 20
      right: 70
      bottom: 50
      left: 10
    @document = @app.window.document
    @d3document = d3.select @document


    if Platform.name == 'browser'
      @renderBrowserTemplate()
    else if Platform.name == 'server'
      @renderServerTemplate()

    @tooltip = @document.getElementById 'tooltip'
    @tooltipParent = @document.getElementById 'wideVisualizationPanel'
    @graphPanel = @document.getElementById 'graphPanel'

    @render()

    @redraw()




  redraw: ->
    # @d3document.select '#graphSVG'
    #   .attr
    #     width: @outerWidth()
    #     height: @outerHeight
    @renderGraph()







  roseData: ->




  # just one rose
  # within the group: normalize to 100px x 100px
  renderRose: (d) ->

    target = @d3document.select '#target'

    target.attr
      height: 100
      width: 100
      fill: 'black'
















module.exports = Visualization5
