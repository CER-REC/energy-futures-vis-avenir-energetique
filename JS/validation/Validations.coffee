Constants = require '../Constants.coffee'


module.exports =

  # TODO: Specific sources lists for different data sources, different visualizations?

  source: (item, rawItem, i, errors) ->
    unless Constants.sources.includes item.source
      errors.push
        message: "Invalid source (CSV field name: Source). Parsed value was #{item.source}"
        line: rawItem
        lineNumber: i

  province: (item, rawItem, i, errors) ->
    unless Constants.provinceRadioSelectionOptions.includes item.province
      errors.push
        message: "Invalid province (CSV field name: Area). Parsed value was #{item.province}"
        line: rawItem
        lineNumber: i

  scenarios: (item, rawItem, i, errors, scenarios) ->
    unless scenarios.includes item.scenario
      errors.push
        message: "Invalid scenario (CSV field name: Case). Parsed value was #{item.scenario}"
        line: rawItem
        lineNumber: i

  years: (item, rawItem, i, errors) ->
    unless Constants.years.includes item.year
      errors.push
        message: "Invalid year (CSV field name: Year). Parsed value was #{item.year}"
        line: rawItem
        lineNumber: i

  value: (item, rawItem, i, errors) ->
    if typeof item.value != 'number' or Number.isNaN(item.value) or item.value < 0
      errors.push
        message: "Invalid value (CSV field name: Data). Parsed value was #{item.value}"
        line: rawItem
        lineNumber: i

  unit: (item, rawItem, i, errors, unit) ->
    unless item.unit == unit
      errors.push
        message: "Invalid unit (CSV field name: Unit). Parsed value was #{item.unit}. Expected #{unit}."
        line: rawItem
        lineNumber: i

  sector: (item, rawItem, i, errors, unit) ->
    unless Constants.sectors.includes item.sector
      errors.push
        message: "Invalid sector (CSV field name: Sector). Parsed value was #{item.sector}"
        line: rawItem
        lineNumber: i









