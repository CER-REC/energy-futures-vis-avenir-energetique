d3 = require 'd3'
d3Path = require 'd3-path'
Mustache = require 'mustache'

Constants = require '../Constants.coffee'
# SquareMenu = require '../charts/SquareMenu.coffee'
# Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'

Rose = require './Rose.coffee'

# ParamsToUrlString = require '../ParamsToUrlString.coffee'
# CommonControls = require './CommonControls.coffee'

if Platform.name == 'browser'
  Visualization5Template = require '../templates/Visualization5.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

# ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'









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
    @margin =
      top: 20
      right: 20
      bottom: 50
      left: 20
    @document = @app.window.document
    @d3document = d3.select @document

    @allCanadaRoses =
      AB: null
      BC: null
      MB: null
      NB: null
      NL: null
      NS: null
      NT: null
      NU: null
      ON: null
      PE: null
      QC: null
      SK: null
      YT: null
    @leftRose = null
    @rightRose = null



    if Platform.name == 'browser'
      @renderBrowserTemplate()
    else if Platform.name == 'server'
      @renderServerTemplate()

    @tooltip = @document.getElementById 'tooltip'
    @tooltipParent = @document.getElementById 'wideVisualizationPanel'
    @graphPanel = @document.getElementById 'graphPanel'

    # preliminary stuff
    # TODO: real numbers please!
    @container = @d3document.select '#graphSVG'
    @container.attr
      height: 1000
      width: '100%'


    @render()

    @redraw()



  graphData: ->
    @app.providers[@config.dataset].energyConsumptionProvider.dataForViz5 @config


  outerWidth: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    # if Platform.name == 'browser'
      @d3document
        .select('#graphPanel')
        .node()
        .getBoundingClientRect()
        .width
    # else if Platform.name == 'server'
    #   Constants.viz4ServerSideGraphWidth


  redraw: ->
    # @d3document.select '#graphSVG'
    #   .attr
    #     width: @outerWidth()
    #     height: @outerHeight
    @renderGraph()











  # just one rose
  # within the group: normalize to 112px x 112px
  render: ->
    if @config.leftProvince == 'all'
      @renderAllCanadaRoses()
    else
      @renderTwoRoses()





  renderAllCanadaRoses: ->

    data = @graphData()

    availableWidth = @outerWidth() - @margin.left - @margin.right - 5 * Constants.roseMargin # also derived from column count ...
    roseSize = availableWidth / 6 # TODO column count, should be constant?
    roseScale = roseSize / Constants.roseSize

    for province, rosePosition of Constants.rosePositions
      group = @container.append 'g'

      xPos = @margin.left + (roseSize + Constants.roseMargin) * rosePosition.column
      yPos = @margin.top + (roseSize + Constants.roseMargin) * rosePosition.row

      group.attr
        transform: "translate(#{xPos}, #{yPos}) scale(#{roseScale}, #{roseScale})"

      rose = new Rose @app,
        container: group
        data: data[province]

      rose.render()

      @allCanadaRoses[province] = rose




  renderTwoRoses: ->


  transitionToAllCanadaRoses: ->

    # figure out which roses to keep, if any
    # transition them to their places
    # animate in the other roses too
    
  transitionToTwoRoses: ->

    # figure out which 1 or 2 roses to animate to
    # transition the two roses
    # animate out the other roses


  renderGraph: ->













module.exports = Visualization5
