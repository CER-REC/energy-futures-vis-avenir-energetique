Constants = require '../Constants.coffee'

# Visualization 1 Accessibility Configuration

# Container for the Visualization 1 graph's accessibility state
# We track two bits of state: the year and the province, and use this to highlight the
# 'active descendent' graph element when the overall graph has focus.
# The accessibility config behaves much like the ordinary configs, being a store of state
# that needs perfectly reliable validation, but the rules for when the state changes
# are different
class Vis1AccessConfig

  constructor: (viz1Config) ->

    @activeProvince = viz1Config.provincesInOrder[0]
    @activeYear = Constants.years[0]



  # We only re-validate the access config when the user next focuses the graph.
  # This way, the user can deactivate and re-activate several provinces and the app can
  # still determine roughly or exactly where they were.
  validate: (viz1Config) ->

    # If the active province is in the current configuration, there is nothing to do
    return if viz1Config.provinces.includes @activeProvince


    activeProvinceIndex = viz1Config.provincesInOrder.indexOf @activeProvince

    # Look at each of the next provinces in provincesInOrder
    # If we find a province that is also in the currently displayed set, it becomes our
    # new active province
    for i in [activeProvinceIndex..viz1Config.provincesInOrder.length]
      if viz1Config.provinces.includes viz1Config.provincesInOrder[i]
        @setProvince viz1Config.provincesInOrder[i]
        return

    # If we don't find an active province going forward, take the last province in the

    # cases:
    # the province we were looking at is gone, but there are other provinces. look up a province which was close to the last one in the order (or just the next one in the order?) and focus it
    # province we were looking at is gone and so are all the others.


  # Up and down arrow inputs change the current province/region.
  # The regions are re-orderable, so we need to consult the current configuration to
  # discover the next province every time.
  
  goToNextProvince: (viz1Config) ->
    # cases to handle:
    # next province is valid
    # there is no next province
    # there are no provinces at all ... can that happen? yes, we can be null and have no provinces
  
  goToPreviousProvince: (viz1Config) ->






  setYear: (year) ->
    return if year > Constants.maxYear
    return if year < Constants.minYear
    @activeYear = year


  # A full text description of the current data.

  description: ->


  # A full text description of the most recent transition. Do I need this?
  lastTransitionDescription: ->




module.exports = Vis1AccessConfig