

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
    'HighLNG ': 'highLng' # NB: The source data column in some of the CSVS has a trailing space in the string 'HighLNG ', this is NOT A TYPO
    'NoLNG': 'noLng'
    'NoLNG ': 'noLng' # NB: The source data column in some of the CSVS has a trailing space in the string 'LowLNG ', this is NOT A TYPO
    'Constrained': 'constrained' 
    'Constrained ': 'constrained' # NB: The source data column in some of the CSVS has a trailing space in the string 'Constrained ', this is NOT A TYPO

  scenarios: [
    'reference'
    'high'
    'low'
    'highLng'
    'noLng'
    'constrained' 
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

  imageExport:
    iconHeight: 30
    iconWidth: 30

    legendWidth: 80
    legendHeight: 680

    scenarioLegendWidth: 145
    scenarioLegendHeight: 680
    scenarioLegendItemWidth: 115 # 145 - 25*2
    scenarioLegendItemHeight: 35
    scenarioLegendFontSize: 15
    scenarioLegendTextTopMargin: 10
    scenarioLegendXPadding: 15

    legendXPadding: 25
    legendYPadding: 15

    headerFontSize: 20
    headerTopBottomMargin: 15

    infoTopSpacer: 40

    infoFontSize: 15
    infoTopBottomMargin: 5
    infoLeftMargin: 25

    sourceRightMargin: 25
    sourceTopMargin: 10


















