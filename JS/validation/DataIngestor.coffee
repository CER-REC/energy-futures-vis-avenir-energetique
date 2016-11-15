fs = require 'fs'
path = require 'path'
d3 = require 'd3'

ApplicationRoot = require '../../ApplicationRoot.coffee'
require '../ArrayIncludes.coffee'


EnergyConsumptionIngestor = require './EnergyConsumptionIngestor.coffee'
OilProductionIngestor = require './OilProductionIngestor.coffee'
GasProductionIngestor = require './GasProductionIngestor.coffee'
ElectricityProductionIngestor = require './ElectricityProductionIngestor.coffee'



# TODO: How to handle specifying input files? 

october2016Files = -> 
  [
    {
      type: 'oil'
      name: "2016-10-18_CrudeOilProduction.csv"
    }
    # {
    #   type: 'gas'
    #   name: "2016-10-18_NaturalGasProduction.csv"
    # }
    # {
    #   type: 'demand'
    #   name: "2016-10-18_EnergyDemand.csv"
    # }
    # {  
    #   type: 'electricity'
    #   name: "2016-10-27_ElectricityGeneration.csv"
    # }
  ]


validate = (files) ->

  for file in files
    ingestor = switch file.type
      when 'oil'
        new OilProductionIngestor file
      when 'gas'
        new GasProductionIngestor file
      when 'demand'
        new EnergyConsumptionIngestor file
      when 'electricity'
        new ElectricityProductionIngestor file
      else
        console.warn "Couldn't read file: #{file.name}. Unknown type #{file.type}."

    # if result.length > 0
    #   console.log "#{result.length} errors in file #{file.name}:"
    #   # console.log result
    # else
    #   console.log "No errors in #{file.name}"





validate october2016Files()



module.exports = validate
