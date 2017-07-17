

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
    'Northwest Territories': 'NT'
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

  datasets: [
    'jan2016'
    'oct2016'
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
      scenariosPerSelection:
        energyDemand: ['high', 'reference', 'low']
        electricityGeneration: ['high', 'reference', 'low']
        oilProduction: ['high', 'reference', 'low']
        gasProduction: ['high', 'reference', 'low']

  # The order in which the scenarios are drawn, in viz4.
  # Generally, this order moves from highest to lowest. Since lower valued scenarios
  # have smaller areas, and are drawn last / on top of higher valued scenarios, this
  # gives us some clickable area for each of the scenarios being drawn.
  # But, there are some configurations where this ordering does not work. And since lines
  # in a line graph can and do cross each other, some configurations have no possible
  # ordering that can work.
  scenarioDrawingOrder: ['high', 'highLng', 'reference', 'noLng', 'constrained', 'low']


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

  serverSideGraphWidth: 1065 # px
  viz4ServerSideGraphWidth: 995 # 1065 - 70 extra pixels of width for viz4's wider legend
  viz5ServerSideGraphWidth: 995 # TODO: Change this later.

  cacheDuration: 3600 # seconds

  # provinces * years, must also be multiplied by scenario count
  itemsPerViz1Viz4ChunkScenario: 14 * 36

  # sources * years, must also be multiplied by scenario count
  itemsPerViz2ChunkScenario: 6 * 36

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
  sliderLabelHeight: 28

  minYear: 2005
  maxYear: 2040

  iconDragDuration: 100 # ms

  tooltipXOffset: 30 # px

  # Viz3 height should total 700px
  viz3Height: 700
  viz3GraphHeight: 620 # px
  viz3SliderHeight: 80 # px
