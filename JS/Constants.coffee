

module.exports = 

  mainSelections: ['energyDemand', 'oilProduction', 'electricityGeneration', 'gasProduction']


  csvProvinceToProvinceCodeMapping:
    'British Columbia': 'BC'
    'Alberta': 'AB'
    'Saskatchewan': 'SK'
    'Manitoba': 'MB'
    'Ontario': 'ON'
    'Quebec': 'QC'
    'New Brunswick': 'NB'
    'Nova Scotia': 'NS'
    'Newfoundland and Labrador': "NL"
    'Prince Edward Island': "PE"
    'Yukon': "YT"
    'Northwest Territories': "NT"
    'Nunavut': "NU"
    'Canada': "all"

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
    'HighLNG ': 'highLng' # NB: The source data column in some of the CSVs has a trailing space in the string 'HighLNG ', this is NOT A TYPO
    'NoLNG': 'noLng'
    'NoLNG ': 'noLng' # NB: The source data column in some of the CSVs has a trailing space in the string 'LowLNG ', this is NOT A TYPO
    'Constrained': 'constrained' 
    'Constrained ': 'constrained' # NB: The source data column in some of the CSVs has a trailing space in the string 'Constrained ', this is NOT A TYPO




  datasets: [
    'jan2016'
    'oct2016'
  ]

  datasetDefinitions:
    jan2016: 
      scenarios: [
        'reference'
        'high'
        'low'
        'highLng'
        'noLng'
        'constrained' 
      ]

    oct2016: 
      scenarios: [
        'reference'
        'high'
        'low'
      ]


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
  ]


  animationDuration: 1000 # in ms

  serverSideGraphWidth: 1065 # px
  viz4ServerSideGraphWidth: 995 # 1065 - 70 extra pixels of width for viz4's wider legend

  cacheDuration: 3600 # seconds

  # provinces * years, must also be multiplied by scenario count
  itemsPerViz1Viz4ChunkScenario: 14 * 36

  # sources * years, must also be multiplied by scenario count
  itemsPerViz2ChunkScenario: 6 * 36

  # provinces * sources * years
  itemsPerViz3Chunk: 13 * 7 * 36










