Constants = require '../Constants.coffee'

# Visualization 1 Accessibility Configuration

# Container for the Visualization 1 graph's accessibility state
# We track two bits of state: the year and the province, and use this to highlight the
# 'active descendent' graph element when the overall graph has focus.
# The accessibility config behaves much like the ordinary configs, being a store of state
# that needs perfectly reliable validation, but the rules for when the state changes
# are different.

# This state is only relevant to the visualization, and is basically internal to it,
# unlike the ordinary configurations.
class Vis1AccessConfig

  constructor: (viz1Config) ->

    @setYear Constants.years[0]

    @activeProvince = viz1Config.provincesInOrder[0]
    @validate viz1Config



  # We only re-validate the access config when the user next focuses the graph.
  # This way, the user can deactivate and re-activate several provinces and the app can
  # still determine roughly or exactly where they were.
  validate: (viz1Config) ->
    # If the active province is in the current configuration, there is nothing to do
    return if viz1Config.provinces.includes @activeProvince

    @setProvince viz1Config.nextActiveProvince(@activeProvince)

    # If viz1Config.provinces is empty, we will arrive here without having changed the
    # province on the accessibility config.
    # This is fine, the case where no provinces are selected is a special case to be
    # handled separately by the UI.


  setProvince: (province) ->
    return unless Constants.provinces.includes province
    @activeProvince = province


  setYear: (year) ->
    return if year > Constants.maxYear or year < Constants.minYear
    @activeYear = year



module.exports = Vis1AccessConfig