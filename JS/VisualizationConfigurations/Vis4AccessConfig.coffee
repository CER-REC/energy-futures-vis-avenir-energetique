Constants = require '../Constants.coffee'

# Visualization 4 Accessibility Configuration

# Container for the Visualization 4 graph's accessibility state
# We track two bits of state: the year and the scenario.

# The accessibility config behaves much like the ordinary configs, being a store of state
# that needs perfectly reliable validation, but the rules for when the state changes
# are different.

# This state is only relevant to the visualization, and is basically internal to it,
# unlike the ordinary configurations.
class Vis4AccessConfig

  constructor: (viz4config) ->

    @setYear Constants.years[0]

    @activeScenario = viz4config.scenarios[0]
    @validate viz4config



  # We only re-validate the access config when the user next focuses the graph.
  # This way, the user can deactivate and re-activate several scenarios and the app can
  # still determine roughly or exactly where they were.
  validate: (viz4config) ->
    # If the active scenario is in the current configuration, there is nothing to do
    return if viz4config.scenarios.includes @activeScenario
    # Otherwise, we need to pick a new active scenario

    if Constants.datasetDefinitions[viz4config.dataset].scenarios.includes @activeScenario
      # The active scenario is in the set of possible scenarios, for this dataset.
      # Find the next nearest scenario to become the new active scenario.
      @setScenario viz4config.nextActiveScenario(@activeScenario), viz4config.dataset
    else
      # The dataset has changed, and the active scenario is not in the set of possible
      # scenarios for the new dataset.
      # In that case, there is no way to locate a 'neighbouring' scenario to select, so we
      # just take the first scenario in the configuration.
      @setScenario viz4config.scenarios[0], viz4config.dataset

    # If viz4config.scenarios is empty, we will arrive here without having changed the
    # scenario on the accessibility config.
    # This is fine, the case where no scenarios are selected is a special case to be
    # handled separately by the UI.


  setScenario: (scenario, dataset) ->
    return unless Constants.datasetDefinitions[dataset].scenarios.includes scenario
    @activeScenario = scenario


  setYear: (year) ->
    return if year > Constants.maxYear or year < Constants.minYear
    @activeYear = year



module.exports = Vis4AccessConfig