# Page Select

This component is meant to be used as a navigator to move between different pages in the application.

## Interaction Requirements

This component is primarily interacted with the use of a mouse.

## Accessibility Requirements

As always, we are translating all text into French if the user clicks on the French link.

## Analytics Requirements

The `reportNav` method on the static `analytics` object is fired when a page button is clicked.
The event call can be found within the `handlePageUpdate` function, that is called from each buttons `onClick` handler.

### Examples:

| Interaction                                  | Call                                                         |
| ---------------------------------------------| -------------------------------------------------------------|
| Click from By Sector viz to Electricity viz. | `analytics.reportNav('by sector', 'electricity generation')` |                                             |                                                              |
| Click from By Region to Scenarios            |`analytics.reportNav('by region', 'scenarios')`               |                                              |                                                              |

The way this is actually used in the code base is by importing the `Analytics` object, and calling the `reportNav` method, passing
in the `config` objects `page` property, and also the page name that the button renders.

Ex.  
`analytics.reportNav(config.page, page);`

## Unit Testing

Testing should be at 100% coverage for this component at the time of writing.

## Examples

There is only one real implementation of this component, and that is to have `<PageSelect />` used within `<PageLayout />` to give
the whole application a side bar to navigate through the pages.

The following example shows `PageSelect` being used with default direction props.
```jsx
        <Grid item style={{ width: 100 }}><PageSelect /></Grid>
```