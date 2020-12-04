# Scenario Select

This component is used as selection control for the different scenarios.


## Interaction Requirements

This component is primarily interacted with the use of a mouse.

## Accessibility Requirements

As always, we are translating all text into French if the user clicks on the French link.

## Analytics Requirements 

The `reportFeature` method on the static `analytics` object is fired when a scenario button is clicked.
The event call can be found within the `handleScenariosUpdate` function, which is called from within `handleScenarioSelect`, that is called from each buttons `onClick` handler.

### Examples: 

| Interaction                                  | Call                                                         |
| ---------------------------------------------| -------------------------------------------------------------|
| Click from By Sector viz to Electricity viz. | `analytics.reportNav('by sector', 'electricity generation')` |                                             |                                                              |
| Click from By Region to Scenarios            |`analytics.reportNav('by region', 'scenarios')`               |                                              |                                                              |

The way this is actually used in the code base is by importing the `analytics` object, and calling the `reportFeature` method, passing
in the `config` objects `page` property, with the string `scenarios` and also the list of scenarios currently selected. This can happen in one of two ways:

The viz only allows a single selection of scenarios, then just convert to lower case.

Ex.  
``` jsx
  const handleScenariosUpdate = useCallback((scenarios) => {
    analytics.reportFeature(config.page, 'scenarios', scenarios.map(s => s.toLowerCase()).join(','));
  }
```


The viz allows for multiple scenario selections, in which case update the list of selected scenarios and run them through the above function.

Ex.  
``` jsx
const updated = config.scenarios.indexOf(scenario) > -1
      ? [...config.scenarios].filter(configScenario => configScenario !== scenario)
      : [...config.scenarios, scenario];
    handleScenariosUpdate(updated);
```

## Unit Testing

At this point we are only testing to see if the default props come through properly.

## Examples

There is only one real implementation of this component, and that is to have `<ScenarioSelect />` used within `<PageLayout />` to give
the application a section for the user to select a scenario.

The following example shows `ScenarioSelect` being used with default multiSelect prop.
```jsx
        <Grid item><ScenarioSelect multiSelect={true} /></Grid>
```