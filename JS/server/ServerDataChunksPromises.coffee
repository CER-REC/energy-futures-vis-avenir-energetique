Promise = require 'bluebird'

ServerData = require './ServerData.coffee'
Constants = require '../Constants.coffee'
Logger = require '../Logger.coffee'

# To avoid downloading all of the data at once for each visualization, we split it up into
# chunks. To ensure reasonable performance and limit complexity, we want the chunks to be 
# few enough that the user won't encounter too many AJAX loads while navigating around 
# the app. 

# Viz 1 and 4 have four chunks per dataset, and share the same chunks. 
# With 3 scenarios, the chunks are 147-182kb
# With 6 scenarios, the chunks are 303-341kb

# Viz 2 has the largest amount of data, and is broken into 70 chunks per dataset.
# With 3 scenarios, the chunks are 80-85kb
# With 6 scenarios, the chunks are 160-172kb

# Viz 3 requires all the data within a given scenario for the 'play' animation, so it is in
# 3 or 6 chunks, one per scenario, depending how many scenarios are in the dataset.
# Each chunk is 313-341kb.


# One thing we need to ensure for viz 1, 2, and 4: each chunk must include all data across
# all scenarios for its parameters, because the maximum data point among all scenarios is
# used to compute the y axis.

# For reference: the total data size for a six scenario dataset is about 6.3mb, and three
# scenario datasets are about 3.1mb.



chunks = {}
promises = {}


createDatasetPromise = (datasetName, datasetDefinition) ->


  return Promise.join ServerData[datasetName].oilPromise, ServerData[datasetName].gasPromise, ServerData[datasetName].energyPromise, ServerData[datasetName].electricityPromise, ->

      # Setup structs

      viz1And4Chunks = {}
      viz2Chunks = {}
      viz3Chunks = {}

      for mainSelection in Constants.mainSelections
        viz1And4Chunks[mainSelection] = []

      for sector in Constants.sectors
        viz2Chunks[sector] = {}
        for province in Constants.provinceRadioSelectionOptions
          viz2Chunks[sector][province] = []

      for scenario in datasetDefinition.scenarios
        viz3Chunks[scenario] = []


      # Populate data

      # Viz 1 and 4
      viz1And4Chunks.oilProduction = ServerData[datasetName].oilProductionProvider.data
      viz1And4Chunks.gasProduction = ServerData[datasetName].gasProductionProvider.data

      for item in ServerData[datasetName].energyConsumptionProvider.data
        if item.source == 'total' and item.sector == 'total'
          viz1And4Chunks.energyDemand.push item

      for item in ServerData[datasetName].electricityProductionProvider.data
        if item.source == 'total'
          viz1And4Chunks.electricityGeneration.push item

      for mainSelection in Constants.mainSelections
        if viz1And4Chunks[mainSelection].length != (Constants.itemsPerViz1Viz4ChunkScenario * datasetDefinition.scenarios.length)
          Logger.error "viz1/4 energy data length not right for #{mainSelection} (#{viz1And4Chunks[mainSelection].length} != #{(Constants.itemsPerViz1Viz4ChunkScenario * datasetDefinition.scenarios.length)})"
        


      # Viz 2
      for item in ServerData[datasetName].energyConsumptionProvider.data
        continue if item.source == 'total'
        viz2Chunks[item.sector][item.province].push item

      for sector in Constants.sectors
        for province in Constants.provinceRadioSelectionOptions
          if viz2Chunks[sector][province].length != (Constants.itemsPerViz2ChunkScenario * datasetDefinition.scenarios.length)
            Logger.error "viz2 data not right for sector #{sector}, province #{province} (#{viz2Chunks[sector][province].length} != #{(Constants.itemsPerViz2ChunkScenario * datasetDefinition.scenarios.length)})"


      # Viz 3
      for item in ServerData[datasetName].electricityProductionProvider.data
        continue if item.source == 'total' or item.province == 'all'
        viz3Chunks[item.scenario].push item

      for scenario in datasetDefinition.scenarios
        if viz3Chunks[scenario].length != Constants.itemsPerViz3Chunk
          Logger.error "viz3 data not right for scenario #{scenario} (#{viz3Chunks[scenario].length} != Constants.itemsPerViz3Chunk)"


      # Write files to disk, in development, to gauge approximate data sizes. 

      # fs = require 'fs'
      # outputDirectory = "/Users/kingp/Projects/neb/#{datasetName}_serializedData"
      # fs.existsSync(outputDirectory) || fs.mkdirSync(outputDirectory)

      # for mainSelection in Constants.mainSelections
      #   fs.writeFile "#{outputDirectory}/viz_1_4_#{mainSelection}.json", JSON.stringify(viz1And4Chunks[mainSelection])

      # for sector in Constants.sectors
      #   fs.writeFile "#{outputDirectory}/viz_2_#{sector}.json", JSON.stringify(viz2Chunks[sector])
      # These come out to 1.1-2.4mb each. Too big!

      # for sector in Constants.sectors
      #   for province in Constants.provinceRadioSelectionOptions
      #     fs.writeFile "#{outputDirectory}/viz_2_#{sector}_#{province}.json", JSON.stringify(viz2Chunks[sector][province])

      # for scenario in datasetDefinition.scenarios
      #   fs.writeFile "#{outputDirectory}/viz_3_#{scenario}.json", JSON.stringify(viz3Chunks[scenario])


      return {
        viz1And4Chunks: viz1And4Chunks
        viz2Chunks: viz2Chunks
        viz3Chunks: viz3Chunks
      }


for datasetName, datasetDefinition of Constants.datasetDefinitions
  promises[datasetName] = createDatasetPromise datasetName, datasetDefinition


module.exports = promises


