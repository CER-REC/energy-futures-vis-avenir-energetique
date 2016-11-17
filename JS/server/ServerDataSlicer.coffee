Promise = require 'bluebird'

ServerData = require './ServerData.coffee'
Constants = require '../Constants.coffee'


# To avoid downloading all of the data at once for each visualization, we split it up into
# chunks. To ensure reasonable performance and limit complexity, we want the chunks to be 
# few enough that the user won't encounter too many AJAX loads while navigating around 
# the app. 

# Viz 1 and 4 have four chunks per dataset, and share the same chunks.
# Viz 2 has the largest amount of data, and is broken into 70 chunks per dataset.
# Viz 3 requires all the data within a given scenario for the 'play' animation, so it is in
# 3 or 6 chunks, depending how many scenarios are in the dataset.

# One thing we need to ensure for viz 1, 2, and 4: each chunk must include all data across
# all scenarios for its parameters, because the maximum data point among all scenarios is
# used to compute the y axis.

# For reference: the total data size for a six scenario dataset is about 6mb, and three
# scenario datasets are about 3mb.


# TODO: Separate set of chunks per datset

# TODO: Don't use providers, keep them single purpose and on client side?

viz1And4Chunks = {}
viz2Chunks = {}
viz3Chunks = {}

Promise.join ServerData.oilPromise, ServerData.gasPromise, ServerData.energyPromise, ServerData.energyPromise, ->

    # Setup structs

    for mainSelection in Constants.mainSelections
      viz1And4Chunks[mainSelection] = []

    for sector in Constants.sectors
      viz2Chunks[sector] = {}
      for province in Constants.provinceRadioSelectionOptions
        viz2Chunks[sector][province] = []

    for scenario in Constants.scenarios
      viz3Chunks[scenario] = []


    # Populate data

    # Viz 1 and 4

    viz1And4Chunks.oilProduction = ServerData.oilProductionProvider.data
    viz1And4Chunks.gasProduction = ServerData.gasProductionProvider.data

    for item in ServerData.energyConsumptionProvider.data
      if item.source == 'total' and item.sector == 'total'
        viz1And4Chunks.energyDemand.push item

    for item in ServerData.electricityProductionProvider.data
      if item.source == 'total'
        viz1And4Chunks.electricityGeneration.push item





    # Viz 2
    for item in ServerData.energyConsumptionProvider.data
      continue if item.source == 'total'
      viz2Chunks[item.sector][item.province].push item

    # Viz 3
    for item in ServerData.electricityProductionProvider.data
      continue if item.source == 'total' or item.province == 'all'
      viz3Chunks[item.scenario].push item



# ServerDataSlicer = 

#   # The data for visualizations 1 and 4 is small enough that we can transmit all of it 
#   # for each data file / main selection.

#   visualization1And4Chunks: (mainSelection) ->
#     switch mainSelection
#       when config.mainSelection == 'energyDemand'
#         'this'
#       when config.mainSelection == 'oilProduction'
#         'that'
#       when config.mainSelection == 'electricityGeneration'
#         'the other'
#       when config.mainSelection == 'gasProduction'
#         'bleh'



#   # The data for visualization 2 is the largest by far. We split it into chunks by province
#   # and sector. 

#   visualization2Chunks: (province, sector) ->
#     data = []
#     for item in sourcedata
#       if item.province == province and item.sector == sector
#         data.push item



#   # The data for visualization 3 is chunked up by scenario. While animating through the
#   # years, the entire data set within one scenario is used, so we can't chunk it up along
#   # any other parameter.
  
#   visualization3Chunks: (scenario) ->
#     data = []
#     for item in sourcedata
#       if item.province == province and item.sector == sector
#         data.push item





















module.exports =
  viz1And4Chunks: viz1And4Chunks
  viz2Chunks: viz2Chunks
  viz3Chunks: viz3Chunks


