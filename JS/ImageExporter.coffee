
# TODO: These modules set up global variables, and must be imported in this order.
# Would be nice to change both of these things. 
require './canvg/StackBlur.js'
require './canvg/canvg.js'

ImageConstants = require('./Constants.coffee').imageExport
Tr = require './TranslationTable.coffee'

d3 = require 'd3'

class ImageExporter

  constructor: ->
    self = @
    # TODO: 
    # Safari is currently experiencing a bug where the SVGs drawn into it do not rescale
    # to the desired size, instead they come out somewhat larger and get clipped.
    # I can't figure out why, every other browser handles this correctly. 
    # Until I can sort it out, just going to go with PNGs.
    # Possibly this: https://bugs.webkit.org/show_bug.cgi?id=134838
    # Which might mean it's addressed in safari >= 9
    @imageMode = 'png'
    # @imageMode = 'svg'
  
    # Uncomment me if we go back to using SVGs
    # @checkDataUrlStrictSecurity()

    document.getElementById('imageDownloadLink').addEventListener 'click', (event) ->
      self.createImage event, @

    @provinceData = 
      BC:
        present: (config) -> config.provinces.includes 'BC' 
        svgUrl: 'IMG/provinces/colour/BC_Selected.svg'
        pngUrl: 'IMG/provinces/colour/BC_Selected.png'
      AB:
        present: (config) -> config.provinces.includes 'AB' 
        svgUrl: 'IMG/provinces/colour/AB_Selected.svg'
        pngUrl: 'IMG/provinces/colour/AB_Selected.png'
      SK: 
        present: (config) -> config.provinces.includes 'SK' 
        svgUrl: 'IMG/provinces/colour/Sask_Selected.svg'
        pngUrl: 'IMG/provinces/colour/Sask_Selected.png'
      MB: 
        present: (config) -> config.provinces.includes 'MB' 
        svgUrl: 'IMG/provinces/colour/MB_Selected.svg'
        pngUrl: 'IMG/provinces/colour/MB_Selected.png'
      ON: 
        present: (config) -> config.provinces.includes 'ON' 
        svgUrl: 'IMG/provinces/colour/ON_Selected.svg'
        pngUrl: 'IMG/provinces/colour/ON_Selected.png'
      QC: 
        present: (config) -> config.provinces.includes 'QC' 
        svgUrl: 'IMG/provinces/colour/QC_Selected.svg'
        pngUrl: 'IMG/provinces/colour/QC_Selected.png'
      NB:
        present: (config) -> config.provinces.includes 'NB' 
        svgUrl: 'IMG/provinces/colour/NB_Selected.svg'
        pngUrl: 'IMG/provinces/colour/NB_Selected.png'
      NS:
        present: (config) -> config.provinces.includes 'NS' 
        svgUrl: 'IMG/provinces/colour/NS_Selected.svg'
        pngUrl: 'IMG/provinces/colour/NS_Selected.png'
      NL:
        present: (config) -> config.provinces.includes 'NL' 
        svgUrl: 'IMG/provinces/colour/NL_Selected.svg'
        pngUrl: 'IMG/provinces/colour/NL_Selected.png'
      PE:
        present: (config) -> config.provinces.includes 'PE' 
        svgUrl: 'IMG/provinces/colour/PEI_Selected.svg'
        pngUrl: 'IMG/provinces/colour/PEI_Selected.png'
      YT:
        present: (config) -> config.provinces.includes 'YT' 
        svgUrl: 'IMG/provinces/colour/Yukon_Selected.svg'
        pngUrl: 'IMG/provinces/colour/Yukon_Selected.png'
      NT:
        present: (config) -> config.provinces.includes 'NT' 
        svgUrl: 'IMG/provinces/colour/NT_Selected.svg'
        pngUrl: 'IMG/provinces/colour/NT_Selected.png'
      NU: 
        present: (config) -> config.provinces.includes 'NU' 
        svgUrl: 'IMG/provinces/colour/NU_Selected.svg'
        pngUrl: 'IMG/provinces/colour/NU_Selected.png'

    for key, item of @provinceData
      # item.svg = new Image ImageConstants.iconWidth, ImageConstants.iconHeight
      # item.svg.src = item.svgUrl
      item.png = new Image ImageConstants.iconWidth, ImageConstants.iconHeight
      item.png.src = item.pngUrl
    
    @sourceData =
      hydro:  
        present: (config) -> config.sources.includes 'hydro'
        svgUrl: 'IMG/sources/hydro_selected.svg'
        pngUrl: 'IMG/sources/hydro_selected.png'
      solarWindGeothermal:
        present: (config) -> config.sources.includes 'solarWindGeothermal'
        svgUrl: 'IMG/sources/solarWindGeo_selected.svg'
        pngUrl: 'IMG/sources/solarWindGeo_selected.png'
      coal:
        present: (config) -> config.sources.includes 'coal'
        svgUrl: 'IMG/sources/coal_selected.svg'
        pngUrl: 'IMG/sources/coal_selected.png'
      naturalGas:
        present: (config) -> config.sources.includes 'naturalGas'
        svgUrl: 'IMG/sources/naturalGas_selected.svg'
        pngUrl: 'IMG/sources/naturalGas_selected.png'
      bio:
        present: (config) -> config.sources.includes 'bio'
        svgUrl: 'IMG/sources/biomass_selected.svg'
        pngUrl: 'IMG/sources/biomass_selected.png'
      oilProducts:
        present: (config) -> config.sources.includes 'oilProducts'
        svgUrl: 'IMG/sources/oil_products_selected.svg'
        pngUrl: 'IMG/sources/oil_products_selected.png'
      nuclear: 
        present: (config) -> config.sources.includes 'nuclear'
        svgUrl: 'IMG/sources/nuclear_selected.svg'
        pngUrl: 'IMG/sources/nuclear_selected.png'
      electricity: 
        present: (config) -> config.sources.includes 'electricity'
        svgUrl: 'IMG/sources/electricity_selected.svg'
        pngUrl: 'IMG/sources/electricity_selected.png'
    
    for key, item of @sourceData
      # item.svg = new Image ImageConstants.iconWidth, ImageConstants.iconHeight
      # item.svg.src = item.svgUrl
      item.png = new Image ImageConstants.iconWidth, ImageConstants.iconHeight
      item.png.src = item.pngUrl




  # Internet Explorer ~11 has a bug in its canvas tainting code: SVGs automatically 
  # taint the canvas no matter whether they're from the same origin or a cross origin.
  # Tainted canvases throw an error if we call toDataURL on them.
  # So, we switch to using PNGs for legends if we detect this problem. 
  # This bug is fixed at least in Edge 13. 
  # https://connect.microsoft.com/ie/feedback/details/828416/cavas-todataurl-method-doesnt-work-after-draw-svg-file-to-canvas
  checkDataUrlStrictSecurity: ->
    svg = new Image ImageConstants.iconWidth, ImageConstants.iconHeight
    svg.onload = =>
      canvas = document.createElement 'canvas'
      ctx = canvas.getContext '2d'
      ctx.drawImage svg, 0, 0, ImageConstants.iconWidth, ImageConstants.iconHeight

      try 
        canvas.toDataURL()
      catch error
        @imageMode = 'png'

    svg.src = 'IMG/provinces/colour/BC_Selected.svg'


  createImage: (event, anchorElement) ->
    event.preventDefault()

    # A left to right list of canvas elements to be combined together
    components = []
    config = null

    switch app.page
      when 'landingPage'
        event.preventDefault()
        return
      when 'viz1'
        config = app.visualization1Configuration
        components.push @buildProvincesCanvas(app.visualization1Configuration)
      when 'viz2'
        config = app.visualization2Configuration
        components.push @buildSourcesCanvas(app.visualization2Configuration)
      when 'viz3'
        config = app.visualization3Configuration
        # Which legend we need depends on the visualization's configuration
        if app.visualization3Configuration.viewBy == 'province'
          components.push @buildSourcesCanvas(app.visualization3Configuration)
        else if app.visualization3Configuration.viewBy == 'source'
          components.push @buildProvincesCanvas(app.visualization3Configuration)
      when 'viz4'
        config = app.visualization4Configuration
        components.push @buildScenariosCanvas(app.visualization4Configuration)
        

    graphCanvas = document.createElement 'canvas'
    svg = new XMLSerializer().serializeToString(document.getElementById('graphSVG'))

    canvgInstance = canvg graphCanvas, svg, 
      renderCallback: =>
        components.push graphCanvas
        @composite components, config, (compositeCanvas) =>

          # Turn the image into a data url, and attach it to the img tag for download
          dataurl = compositeCanvas.toDataURL 'image/png'
          imgElement = new Image()
          imgElement.setAttribute 'src', dataurl
          document.getElementById('renderedImageContainer').innerHTML = ""
          document.getElementById('renderedImageContainer').appendChild imgElement
          d3.select('#imageDownloadModal').classed 'hidden', false
          








    




  # Viz1 or Viz3 config
  buildProvincesCanvas: (config) ->
    canvas = document.createElement 'canvas'

    canvas.setAttribute 'width', ImageConstants.legendWidth
    canvas.setAttribute 'height', ImageConstants.legendHeight
    context = canvas.getContext "2d"
    context.fillStyle = 'white'
    context.fillRect 0, 0, ImageConstants.legendWidth, ImageConstants.legendHeight




    nextYCoordinate = 15

    # We slice the provinces to create a copy in memory, so that we don't mutate the 
    # original when we reverse it.
    for province in config.provincesInOrder.slice().reverse()
      data = @provinceData[province]
      continue unless data.present config

      context.drawImage data[@imageMode], 25, nextYCoordinate, ImageConstants.iconWidth, ImageConstants.iconHeight
      nextYCoordinate += 45 # 30 for height of the image, 15 for padding between images 

    canvas









  # Viz2 or Viz3 config
  buildSourcesCanvas: (config) ->
    canvas = document.createElement 'canvas'

    canvas.setAttribute 'width', ImageConstants.legendWidth
    canvas.setAttribute 'height', ImageConstants.legendHeight
    context = canvas.getContext "2d"
    context.fillStyle = 'white'
    context.fillRect 0, 0, ImageConstants.legendWidth, ImageConstants.legendHeight


    
    nextYCoordinate = ImageConstants.legendYPadding

    # We slice the provinces to create a copy in memory, so that we don't mutate the 
    # original when we reverse it.
    for source in config.sourcesInOrder.slice().reverse()
      data = @sourceData[source]
      continue unless data.present config

      context.drawImage data[@imageMode], ImageConstants.legendXPadding, nextYCoordinate, ImageConstants.iconWidth, ImageConstants.iconHeight
      # 30 for height of the image, 15 for padding between images 
      nextYCoordinate += (ImageConstants.legendYPadding + ImageConstants.iconHeight)
    
    canvas

  buildScenariosCanvas: (config) ->
    canvas = document.createElement 'canvas'

    canvas.setAttribute 'width', ImageConstants.scenarioLegendWidth
    canvas.setAttribute 'height', ImageConstants.scenarioLegendHeight
    context = canvas.getContext "2d"
    context.fillStyle = 'white'
    context.fillRect 0, 0, ImageConstants.legendWidth, ImageConstants.legendHeight

    scenarioData = 
      reference:
        label: Tr.scenarioSelector.referenceButton[app.language]
        colour: '#999999'
      high:
        label: Tr.scenarioSelector.highPriceButton[app.language]
        colour: '#0C2C84'
      highLng:
        label: Tr.scenarioSelector.highLngButton[app.language]
        colour: '#225EA8'
      constrained:
        label: Tr.scenarioSelector.constrainedButton[app.language]
        colour: '#41B6C4'
      low:
        label: Tr.scenarioSelector.lowPriceButton[app.language]
        colour: '#7FCDBB'
      noLng:
        label: Tr.scenarioSelector.noLngButton[app.language]
        colour: '#C7E9B4'

    potentialScenarios = switch config.mainSelection
      when 'energyDemand', 'electricityGeneration'
        ['reference', 'high', 'highLng', 'constrained', 'low', 'noLng']
      when 'oilProduction'
        ['reference', 'high', 'constrained', 'low']
      when 'gasProduction'
        ['reference', 'high', 'highLng', 'low', 'noLng']


    nextYCoordinate = ImageConstants.legendYPadding

    for scenario in potentialScenarios
      continue unless config.scenarios.includes scenario
      data = scenarioData[scenario]

      # Draw a backing rectangle to serve as colour swatch
      context.fillStyle = data.colour
      context.fillRect ImageConstants.scenarioLegendXPadding, 
        nextYCoordinate, 
        ImageConstants.scenarioLegendItemWidth, 
        ImageConstants.scenarioLegendItemHeight


      # Draw the label for the scenario
      context.fillStyle = 'white'
      context.font = "#{ImageConstants.scenarioLegendFontSize}px Avenir Next Demi Condensed, PT Sans Narrow"
      textWidth = context.measureText data.label

      context.fillText data.label, 
        ImageConstants.scenarioLegendXPadding + ImageConstants.scenarioLegendItemWidth/2 - textWidth.width/2, 
        nextYCoordinate + ImageConstants.scenarioLegendTextTopMargin + ImageConstants.scenarioLegendFontSize

      nextYCoordinate += (ImageConstants.scenarioLegendItemHeight + ImageConstants.legendYPadding)

    canvas
      





  composite: (components, config, callback) ->
    # compute dimensions for destination canvas
    xDimension = 0
    yDimension = 0
    for component in components
      xDimension += component.width
      yDimension = component.height if component.height > yDimension

    titleData = 
      viz1: Tr.visualization1Titles[config.mainSelection][app.language]
      viz2: Tr.visualization2Title[app.language]
      viz3: Tr.visualization3Title[app.language]
      viz4: Tr.visualization4Titles[config.mainSelection][app.language]

    # Additional height to allow for titles and supplementary text
    yDimension += ImageConstants.infoTopSpacer +
      ImageConstants.headerFontSize +
      ImageConstants.headerTopBottomMargin * 2 +
      ImageConstants.infoFontSize * 2 +
      ImageConstants.infoTopBottomMargin * 4
    

    headerTotalHeight = ImageConstants.headerFontSize + ImageConstants.headerTopBottomMargin * 2

    # make canvas, initialize with white background
    canvas = document.createElement 'canvas'

    canvas.width = xDimension
    canvas.height = yDimension
    context = canvas.getContext "2d"
    context.fillStyle = 'white'
    context.fillRect 0, 0, xDimension, yDimension

    # add components
    nextXCoordinate = 0
    for component in components
      context.drawImage component, 
        nextXCoordinate, 
        headerTotalHeight, 
        component.width, 
        component.height
      nextXCoordinate += component.width

    # Draw Title
    context.font = "#{ImageConstants.headerFontSize}px Avenir Next Demi Condensed, PT Sans Narrow"
    text = titleData[app.page]
    textWidth = context.measureText text
    context.fillStyle = '#333333'
    context.fillText text, 
      xDimension/2 - textWidth.width/2, 
      ImageConstants.headerTopBottomMargin + ImageConstants.headerFontSize


    # Draw Info
    context.font = "#{ImageConstants.infoFontSize}px Avenir Next Demi Condensed, PT Sans Narrow"
    infoText = config.imageExportDescription()
    textTop = (ImageConstants.infoTopSpacer + 
      ImageConstants.headerTopBottomMargin*2 +
      ImageConstants.headerFontSize +
      ImageConstants.legendHeight + # NB: Not sure if this is correct. Should be max(legends, graph)
      ImageConstants.infoTopBottomMargin + 
      ImageConstants.infoFontSize/2
    )

    context.fillText infoText, 
      ImageConstants.infoLeftMargin, 
      textTop

    # Draw Source
    context.font = "#{ImageConstants.infoFontSize}px Avenir Next Demi Condensed, PT Sans Narrow"
    text = Tr.allPages.imageDownloadSource[app.language]
    textWidth = context.measureText text
    
    # We want it to be on the same line as info unless they are too long then add a line
    infoTextWidth = context.measureText infoText
    if (textWidth.width + infoTextWidth.width) > (xDimension - ImageConstants.infoLeftMargin - ImageConstants.sourceRightMargin)
      textTop = textTop + ImageConstants.infoFontSize + ImageConstants.sourceTopMargin

    context.fillText text, 
      xDimension - textWidth.width - ImageConstants.sourceRightMargin, 
      textTop
      

    # Stub for bitly link generation code. 
    # Uncomment to see a bitly link included in the exported image.
    # ShortLinkBitly = (__, callback) ->
    #   callback 'http://bit.ly/1KFQCvu' # NEB homepage <3

    # Draw Bitly Link, if the Bitly module is available on the global scope
    if ShortLinkBitly?
      ShortLinkBitly false, (url) ->


        context.font = "#{ImageConstants.infoFontSize}px Avenir Next Demi Condensed, PT Sans Narrow"
        text = "#{url}"
        textTop = (ImageConstants.infoTopSpacer + 
          ImageConstants.headerTopBottomMargin*2 +
          ImageConstants.headerFontSize +
          ImageConstants.legendHeight + # NB: Not sure if this is correct. Should be max(legends, graph)
          ImageConstants.infoTopBottomMargin*3 + 
          ImageConstants.infoFontSize*1.5
        )

        context.fillText text, 
          ImageConstants.infoLeftMargin, 
          textTop

        callback canvas
    else
      callback canvas






module.exports = ImageExporter