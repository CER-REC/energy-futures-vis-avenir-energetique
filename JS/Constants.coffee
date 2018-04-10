

module.exports =

  appHost: 'https://apps2.neb-one.gc.ca/dvs'

  mainSelections: [
    'energyDemand'
    'oilProduction'
    'electricityGeneration'
    'gasProduction'
  ]


  csvProvinceToProvinceCodeMapping:
    'British Columbia': 'BC'
    'Alberta': 'AB'
    'Saskatchewan': 'SK'
    'Manitoba': 'MB'
    'Ontario': 'ON'
    'Quebec': 'QC'
    'New Brunswick': 'NB'
    'Nova Scotia': 'NS'
    'Newfoundland and Labrador': 'NL'
    'Prince Edward Island': 'PE'
    'Yukon': 'YT'
    # NB: Yukon has a trailing space in some of the CSVs.
    'Yukon ': 'YT'
    'Northwest Territories': 'NT'
    # NB: Northwest Territories has a trailing space in some of the CSVs. 
    'Northwest Territories ': 'NT'
    'Nunavut': 'NU'
    'Canada': 'all'

  csvSourceToSourceNameMapping:
    'Hydro': 'hydro'
    'Solar/Wind/Geothermal' : 'solarWindGeothermal'
    'Coal': 'coal'
    'Natural Gas': 'naturalGas'
    'Biofuels/Biomass' : 'bio'
    'Biomass and Biofuels' : 'bio' # In some CSVs
    'Nuclear': 'nuclear'
    'Oil Products' : 'oilProducts'
    'Crude Oil' : 'crudeOil'
    'Electricity' : 'electricity'
    'Total Generation' : 'total'
    'Total' : 'total' # NB: The total column is labeled differently in certain CSVs


  sources: [
    'hydro'
    'solarWindGeothermal'
    'coal'
    'naturalGas'
    'bio'
    'nuclear'
    'oilProducts'
    'crudeOil'
    'electricity'
    'total'
  ]

  csvScenarioToScenarioNameMapping:
    'Reference': 'reference'
    'High': 'high'
    'Low': 'low'
    'HighLNG': 'highLng'
    # NB: The source data column in some of the CSVs has a trailing space in the string
    # 'HighLNG ', this is NOT A TYPO
    'HighLNG ': 'highLng'
    'NoLNG': 'noLng'
    # NB: The source data column in some of the CSVs has a trailing space in the string
    # 'LowLNG ', this is NOT A TYPO
    'NoLNG ': 'noLng'
    'Constrained': 'constrained'
    # NB: The source data column in some of the CSVs has a trailing space in the string
    # 'Constrained ', this is NOT A TYPO
    'Constrained ': 'constrained'
    'HCP': 'hcp'
    'Technology': 'technology'
    'HTC': 'technology'

  datasets: [
    'jan2016'
    'oct2016'
    'oct2017'
  ]


  datasetDefinitions:
    jan2016:
      scenarios: [
        'reference'
        'high'
        'highLng'
        'constrained'
        'low'
        'noLng'
      ]
      scenariosForIngestion:
        energyDemand: ['high', 'highLng', 'reference', 'noLng', 'constrained', 'low']
        electricityGeneration: ['high', 'highLng', 'reference', 'noLng', 'constrained', 'low']
        oilProduction: ['high', 'highLng', 'reference', 'noLng', 'constrained', 'low']
        gasProduction: ['high', 'highLng', 'reference', 'noLng', 'constrained', 'low']    
      scenariosPerSelection:
        energyDemand: ['high', 'highLng', 'reference', 'noLng', 'constrained', 'low']
        electricityGeneration: ['high', 'highLng', 'reference', 'noLng', 'constrained', 'low']
        oilProduction: ['high', 'reference', 'constrained', 'low']
        gasProduction: ['high', 'highLng', 'reference', 'noLng', 'low']


    oct2016:
      scenarios: [
        'reference'
        'high'
        'low'
      ]
      scenariosForIngestion:
        energyDemand: ['high', 'reference', 'low']
        electricityGeneration: ['high', 'reference', 'low']
        oilProduction: ['high', 'reference', 'low']
        gasProduction: ['high', 'reference', 'low']
      scenariosPerSelection:
        energyDemand: ['high', 'reference', 'low']
        electricityGeneration: ['high', 'reference', 'low']
        oilProduction: ['high', 'reference', 'low']
        gasProduction: ['high', 'reference', 'low']


    oct2017:
      scenarios: [
        'reference'
        'hcp'
        'technology'
      ]
      scenariosForIngestion:
        energyDemand: ['reference', 'technology', 'hcp']
        electricityGeneration: ['reference', 'technology', 'hcp']
        oilProduction: ['reference', 'technology', 'hcp']
        gasProduction: ['reference', 'technology', 'hcp'] 
      scenariosPerSelection:
        energyDemand: ['reference', 'technology', 'hcp']
        electricityGeneration: ['reference', 'technology', 'hcp']
        oilProduction: ['reference', 'technology', 'hcp']
        gasProduction: ['reference', 'technology', 'hcp']

  # The order in which the scenarios are drawn, in viz4.
  # Generally, this order moves from highest to lowest. Since lower valued scenarios
  # have smaller areas, and are drawn last / on top of higher valued scenarios, this
  # gives us some clickable area for each of the scenarios being drawn.
  # But, there are some configurations where this ordering does not work. And since lines
  # in a line graph can and do cross each other, some configurations have no possible
  # ordering that can work.
  scenarioDrawingOrder: ['high', 'highLng', 'reference', 'noLng', 'constrained', 'low', 'technology', 'hcp']


  years: [
    2005
    2006
    2007
    2008
    2009
    2010
    2011
    2012
    2013
    2014
    2015
    2016
    2017
    2018
    2019
    2020
    2021
    2022
    2023
    2024
    2025
    2026
    2027
    2028
    2029
    2030
    2031
    2032
    2033
    2034
    2035
    2036
    2037
    2038
    2039
    2040
  ]

  csvSectorToSectorNameMapping:
    'Total End Use': 'total'
    'Residential Sector': 'residential'
    'Commercial Sector': 'commercial'
    'Industrial Sector': 'industrial'
    'Transportation Sector': 'transportation'


  provinces: [
    'AB'
    'BC'
    'MB'
    'NB'
    'NL'
    'NS'
    'NT'
    'NU'
    'ON'
    'PE'
    'QC'
    'SK'
    'YT'
  ]

  provinceRadioSelectionOptions: [
    'all'
    'AB'
    'BC'
    'MB'
    'NB'
    'NL'
    'NS'
    'NT'
    'NU'
    'ON'
    'PE'
    'QC'
    'SK'
    'YT'
  ]

  viz5leftProvinceMenuOption: [
    'all'
    'Canada'
    'AB'
    'BC'
    'MB'
    'NB'
    'NL'
    'NS'
    'NT'
    'NU'
    'ON'
    'PE'
    'QC'
    'SK'
    'YT'
  ]

  viz5rightProvinceMenuOption: [
    'Canada'
    'AB'
    'BC'
    'MB'
    'NB'
    'NL'
    'NS'
    'NT'
    'NU'
    'ON'
    'PE'
    'QC'
    'SK'
    'YT'
  ]

  sectors: [
    'residential'
    'commercial'
    'industrial'
    'transportation'
    'total'
  ]

  viz2Sources: [
    'electricity'
    'oilProducts'
    'bio'
    'naturalGas'
    'coal'
    'solarWindGeothermal'
  ]

  viz3Sources: [
    'hydro'
    'solarWindGeothermal'
    'coal'
    'naturalGas'
    'bio'
    'nuclear'
    'oilProducts'
  ]

  viz3SourceRadioSelectionOptions: [
    'total'
    'hydro'
    'solarWindGeothermal'
    'coal'
    'naturalGas'
    'bio'
    'nuclear'
    'oilProducts'
  ]

  pages: [
    'landingPage'
    'viz1'
    'viz2'
    'viz3'
    'viz4'
    'viz5'
  ]


  animationDuration: 1000 # in ms
  rosePopUpDuration: 300 # in ms

  roseFullScale: 1
  roseSlightlyBiggerScale: 1.1

  roseBorderOffset:
    'small': 2 # in px
    'large': 2 # in px

  serverSideGraphWidth: 1065 # px
  viz4ServerSideGraphWidth: 995 # 1065 - 70 extra pixels of width for viz4's wider legend

  cacheDuration: 3600 # seconds

  # provinces * years, must also be multiplied by scenario count
  itemsPerViz1Viz4ChunkScenario: 14 * 36

  # sources * years, must also be multiplied by scenario count
  itemsPerViz2Viz5ChunkScenario: 6 * 36

  # provinces * sources * years
  itemsPerViz3Chunk: 13 * 7 * 36



  socialCropSize:
    width: 1200
    height: 630

  pngRenderSleepTime: 50 # ms


  googleAnalyticsCustomDimensions:
    unit: 'dimension1'
    page: 'dimension2'
    mainSelection: 'dimension3'
    scenario: 'dimension4'
    provinces: 'dimension5'
    provincesInOrder: 'dimension6'
    dataset: 'dimension7'
    sector: 'dimension8'
    sources: 'dimension9'
    sourcesInOrder: 'dimension10'
    province: 'dimension11'
    viewBy: 'dimension12'
    year: 'dimension13'
    source: 'dimension14'
    scenarios: 'dimension15'

  questionMarkHeight: 23
  boxesOffset: 46

  timelineMargin: 25
  allCanadaTimelineMargin: 30
  viz5timelineMargin: 45
  baseYearTimelineMargin: 45
  sliderLabelHeight: 28
  viz5timelineDuration: 500
  viz5LegendIconSize: 25

  comparisonSliderWidth: 70
  baseSliderWidth: 80

  hideBaseYearLabel: [
    2005
    2006
    2007
    2008
  ]

  minYear: 2005
  maxYear: 2040

  iconDragDuration: 100 # ms

  tooltipXOffset: 30 # px

  # Viz3 height should total 700px
  viz3Height: 700
  viz5Height: 700
  viz3GraphHeight: 620 # px
  viz3SliderHeight: 80 # px

  # Rose dimensions are normalized to a 112x112 canvas / group, which is re-scaled in the
  # visualization.
  roseSize: 118 # px
  roseOuterCircleRadius: 55 # px
  roseBaselineCircleRadius: 35 # px
  roseCentreCircleRadius: 12 # px

  roseOuterCircleDataRadius: 20 # px
  roseCentreCircleDataRadius: -20 # px

  twoRoseTopMargin: 100
  viz5GraphSVGHeight: 538

  # All in radians
  roseAngles: [
    0
    Math.PI * 1 / 3
    Math.PI * 2 / 3
    Math.PI * 3 / 3
    Math.PI * 4 / 3
    Math.PI * 5 / 3
  ]

  # All in px
  # These distances are relative to the rose baseline circle, toward or away from the
  # centre of the rose.
  roseTickDistances: [
    -15
    -10
    -5
    5
    10
    15
  ]

  roseTickLength: 8 # px
  roseThornLength: 4 # px

  thornAngularWidth: Math.PI / 32

  roseColumns: 6
  # Indexed from the top left
  rosePositions:
    YT:
      row: 0.25
      column: 0
    NT:
      row: 0.25
      column: 1
    NU:
      row: 0.25
      column: 2
    Canada: 
      row: 0.25
      column: 3.5
    NL:
      row: 0.25
      column: 5
    BC:
      row: 1.25
      column: 0
    AB:
      row: 1.25
      column: 1
    SK:
      row: 1.25
      column:2
    MB:
      row: 1.25
      column: 3
    ON:
      row: 1.25
      column: 4
    QC:
      row: 1.25
      column: 5

    NB:
      row: 2.25
      column: 3
    PE:
      row: 2.25
      column: 4
    NS:
      row: 2.25
      column: 5

  roseStartingPositionOffsets:
    YT:
      x: 165
      y: 265
    NT:
      x: 275
      y: 265
    NU:
      x: 370
      y: 265
    Canada: 
      x: 440
      y: 285
    NL:
      x: 648
      y: 265
    BC:
      x: 207
      y: 385
    AB:
      x: 270
      y: 385
    SK:
      x: 327
      y: 385
    MB:
      x: 384
      y: 385
    ON:
      x: 460
      y: 385
    QC:
      x: 555
      y: 385
    NB:
      x: 605
      y: 385
    PE:
      x: 640
      y: 344
    NS:
      x: 650
      y: 385

  fullRoseRenderingDelay:
    Canada: 400 #
    YT: 800   #
    NT: 1200  #
    NU: 1520  #
    NL: 1440  #
    BC: 1280  #
    AB: 880   #
    SK: 1600  #
    MB: 1040  #
    ON: 1680  #
    QC: 1120  #
    NB: 1360  #
    PE: 1760  #
    NS: 960   #

  allCanadaRoseMargin: 11 # px
  comparisonRoseMargin: 65 # px

  viz5SourcesInOrder: [
    'electricity'
    'naturalGas'
    'bio'
    'solarWindGeothermal'
    'coal'
    'oilProducts'
  ]




  viz5RoseData:
    electricity:
      colour: '#33cccc' # teal
      startAngle: Math.PI * (0 / 3)
      image: 'IMG/sources/electricity_selected.svg'
    naturalGas:
      colour: '#f16739' # orange
      startAngle: Math.PI * (1 / 3)
      image: 'IMG/sources/naturalGas_selected.svg'
    bio:
      colour: '#8d68ac' # purple
      startAngle: Math.PI * (2 / 3)
      image: 'IMG/sources/biomass_selected.svg'
    solarWindGeothermal:
      colour: '#339947' # green
      startAngle: Math.PI * (3 / 3)
      image: 'IMG/sources/solarWindGeo_selected.svg'
    coal:
      colour: '#996733' # brown
      startAngle: Math.PI * (4 / 3)
      image: 'IMG/sources/coal_selected.svg'
    oilProducts:
      colour: '#cc6699' # pink
      startAngle: Math.PI * (5 / 3)
      image: 'IMG/sources/oil_products_selected.svg'




  viz5SliderHeight: 100 # px

  viz5LegendData: [
      'IMG/sources/oil_products_selected.svg'
      'IMG/sources/electricity_selected.svg'
      'IMG/sources/naturalGas_selected.svg'
      'IMG/sources/biomass_selected.svg'
      'IMG/sources/solarWindGeo_selected.svg'
      'IMG/sources/coal_selected.svg'
    ]

  pagePadding: 10 # px
  # NB: This value should be kept in sync with the padding style for #mainPanel > div

  pillPopoverWidth: 220 # px
  pillPopoverHeight: 125 # px



  pillAnimationDuration: 100 # ms

  viz5ServerSideRosePositions:
    leftRose:
      left: 370
      top: 370
    rightRose:
      left: 890
      top: 370
  viz5ServerSideRoseSize: 410

  # Keep these sizes consistent with the dimensions in pills.css
  viz5PillSizes: # all in px
    large:
      width: 77
      height: 29.7
    small:
      width: 52.5
      height: 21

  viz5PillAlignmentMargins:
    large:
      coal: 0
      naturalGas: 0
      bio: 0
      solarWindGeothermal: 0
      electricity: 0
      oilProducts: 0
    small:
      coal: 0
      naturalGas: 0
      bio: -10
      solarWindGeothermal: -10
      electricity: 10
      oilProducts: 10


  mapleLeafCenterOffset: 2
  mapleLeafCircleRadius: 11.5
  mapleLeafCircleStroke: 0.5
  mapleLeafScale: 0.065
  mapleLeafPath: "m 154.99433,0 -25.06359,46.7528 c -2.844,5.08126 -7.93959,4.60996 -13.03517,1.77192 l -18.14538,-9.39723 13.52402,71.81132 c 2.844,13.11953 -6.28082,13.11953 -10.78395,7.44687 L 69.82305,82.93015 64.68194,100.93531 c -0.59287,2.36446 -3.19957,4.84789 -7.11025,4.25649 l -40.04353,-8.42033 10.51769,38.24325 c 2.25156,8.50956 4.00782,12.03281 -2.27304,14.27716 L 11.5,156.00092 80.43236,211.99997 c 2.72839,2.11737 4.10687,5.92775 3.13555,9.37778 l -6.03305,19.8011 c 23.73443,-2.73623 45.00085,-6.85284 68.74731,-9.38813 2.09632,-0.22382 5.60582,3.23618 5.59142,5.66585 L 148.72882,310 l 11.5398,0 -1.81651,-72.38785 c -0.0145,-2.42967 3.16938,-6.04525 5.26571,-5.82143 23.74645,2.5353 45.0129,6.6519 68.74732,9.38813 l -6.03303,-19.8011 c -0.97132,-3.45003 0.40715,-7.26041 3.13554,-9.37778 L 298.5,156.00092 284.2272,149.29188 c -6.28088,-2.24435 -4.52461,-5.7676 -2.27305,-14.27716 l 10.51772,-38.24325 -40.04357,8.42033 c -3.91067,0.5914 -6.51737,-1.89203 -7.11026,-4.25649 l -5.1411,-18.00516 -31.6672,35.45553 c -4.50314,5.67266 -13.62798,5.67266 -10.78397,-7.44687 l 13.524,-71.81132 -18.14534,9.39723 c -5.09571,2.83804 -10.19117,3.30934 -13.03518,-1.77192"

  # To match duration of pills animations in CSS.
  viz5PillPopoverDuration: 300 # ms


  petalLayers: [
    {
      layer: 0
      class: 'petal1'
      darken: 0
    }
    {
      layer: 1
      class: 'petal2'
      darken: 0.9
    }
    {
      layer: 2
      class: 'petal3'
      darken: 1.8
    }
    {
      layer: 3
      class: 'petal4'
      darken: 2.7
    }

  ]

