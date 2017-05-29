Constants = require '../Constants.coffee'

# Visualization 2 Accessibility Configuration

# Container for the Visualization 2 graph's accessibility state
# We track two bits of state: the year and the source.

# The accessibility config behaves much like the ordinary configs, being a store of state
# that needs perfectly reliable validation, but the rules for when the state changes
# are different.

# This state is only relevant to the visualization, and is basically internal to it,
# unlike the ordinary configurations.
class Vis2AccessConfig

  constructor: (viz2config) ->

    @setYear Constants.years[0]

    @activeSource = viz2config.sourcesInOrder[0]
    @validate viz2config



  # We only re-validate the access config when the user next focuses the graph.
  # This way, the user can deactivate and re-activate several sources and the app can
  # still determine roughly or exactly where they were.
  validate: (viz2config) ->
    # If the active source is in the current configuration, there is nothing to do
    return if viz2config.sources.includes @activeSource

    @setSource viz2config.nextActiveSource(@activeSource)

    # if viz2config.sources is empty, we will arrive here without having changed the
    # source on the accessibility config.
    # This is fine, the case where no sources are selected is a special case to be
    # handled separately by the UI.


  setSource: (source) ->
    return unless Constants.viz2Sources.includes source
    @activeSource = source


  setYear: (year) ->
    return if year > Constants.maxYear or year < Constants.minYear
    @activeYear = year



module.exports = Vis2AccessConfig