Constants = require '../Constants.coffee'

# Visualization 3 Accessibility Configuration

# Container for the Visualization 3 graph's accessibility state
# We track two bits of state: the region and the source.

# The accessibility config behaves much like the ordinary configs, being a store of state
# that needs perfectly reliable validation, but the rules for when the state changes
# are different.

# This state is only relevant to the visualization, and is basically internal to it,
# unlike the ordinary configurations.
class Vis3AccessConfig

  constructor: (viz3config, data) ->

    # TODO: I think we can dispose of the rest of this constructor junk and just rely
    # on the validation logic

    # switch viz3config.viewBy
    #   when 'province'
    #     @setProvince viz3config.province, data
    #     @setSource viz3config.sources[0], data
    #   when 'source'
    #     @setSource viz3config.source, data
    #     @setProvince viz3config.provinces[0], data

    # # If there are no provinces/sources selected, or if province/source is set to 'all'/
    # # 'total', these values can be un-initialized
    # @setProvince Constants.provinces[0], data unless @activeProvince?
    # @setSource Constants.viz3Sources[0], data unless @activeSource?

    @validate viz3config, data



  # We only re-validate the access config when the user next focuses the graph.
  # This way, the user can deactivate and re-activate several scenarios and the app can
  # still determine roughly or exactly where they were.
  validate: (viz3config, data) ->
    return if @datasetContains {source: @activeSource, province: @activeProvince}, data

    switch viz3config.viewBy
      when 'province'
        # First by region, then by source
        for secondLevelItem in data.children
          for thirdLevelItem in secondLevelItem.children
            # A value of 1 signifies that there is no data here, and the bubble graph
            # engine should not draw the item.
            continue if thirdLevelItem.value == 1
            @setState secondLevelItem.name, thirdLevelItem.leafName, data
            return

      when 'source'
        # First by source, then by region
        for secondLevelItem in data.children
          for thirdLevelItem in secondLevelItem.children
            # A value of 1 signifies that there is no data here, and the bubble graph
            # engine should not draw the item.
            continue if thirdLevelItem.value == 1
            @setState thirdLevelItem.leafName, secondLevelItem.name, data
            return


    # If there is no data on display, we will arrive here without having changed
    # anything.
    # This is fine, the special case is handled separately by the UI.



  # Unlike the other visualizations, we can't determine whether a selection is valid from
  # the configuration. We need the full set of data at the current config to detect
  # whether a data point exists for the config we want to transition to.

  # Frequently, we want to set both source and province at once.
  # But, if we set these two attributes sequentially and the 'in between' state is invalid
  # we will fail.
  setState: (province, source, data) ->
    return unless @datasetContains {source: source, province: province}, data
    return unless Constants.provinces.includes province
    return unless Constants.viz3Sources.includes source
    @activeProvince = province
    @activeSource = source

  setProvince: (province, data) ->
    return unless Constants.provinces.includes province
    return unless @datasetContains {source: @activeSource, province: province}, data
    @activeProvince = province

  setSource: (source, data) ->
    return unless Constants.viz3Sources.includes source
    return unless @datasetContains {source: source, province: @activeProvince}, data
    @activeSource = source



  # TODO: what to name this?
  # Does the given set of data contain this data item?
  # item: an object with province, source
  # data: a data object for viz3 as produced by the electricity production provider
  datasetContains: (item, data) ->
    switch data.viewBy
      when 'province'
        # Search first by region, then by source
        secondLevelItems = data.children.find (searchItem) ->
          searchItem.name == item.province
        return false unless secondLevelItems?
        thirdLevelItem = secondLevelItems.children.find (searchItem) ->
          searchItem.leafName == item.source
        # A value of 1 signifies that there is no data, and that the bubble graph
        # engine should not draw the circle in question. Don't ask me how 1 was chosen
        # as the magic number for this.
        return thirdLevelItem? and thirdLevelItem.value != 1

      when 'source'
        # Search first by source, then by region
        secondLevelItems = data.children.find (searchItem) ->
          searchItem.name == item.source
        return false unless secondLevelItems?
        thirdLevelItem = secondLevelItems.children.find (searchItem) ->
          searchItem.leafName == item.province
        # A value of 1 signifies that there is no data, and that the bubble graph
        # engine should not draw the circle in question. Don't ask me how 1 was chosen
        # as the magic number for this.
        return thirdLevelItem? and thirdLevelItem.value != 1


  # True if there is at least one data item on display, false when everything in the
  # the dataset is hidden / the dataset is empty
  # data: a data object for viz3 as produced by the electricity production provider
  atLeastOneDataItemOnDisplay: (data) ->
    for secondLevelItem in data.children
      for thirdLevelItem in secondLevelItem.children
        # A value of 1 signifies that there is no data here, and the bubble graph
        # engine should not draw the item.
        if thirdLevelItem.value == 1
          continue
        else
          return true

    return false


module.exports = Vis3AccessConfig
