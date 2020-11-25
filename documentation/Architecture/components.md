# Components

React components should be written as pure components, regardless of whether
they are class or functional components.

```js
class PureClassComponent extends React.PureComponent {}

// If the props or state changing doesn't necessarily trigger a render, we can
// further optimize the component by handling shouldComponentUpdate ourselves.
class ManualPureClassComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (...) { return true; }
    return false;
  }
}

```

Components should be stored in `app/components/ComponentName/`.

## Public vs Private components

Any component that is used by a View, or by two or more other components should
have its own folder and be considered a `Public` component. Anything that is
only used by a single component should be placed in a subfolder of that component, and
is treated as an `Private` component.

Private components should be refactored into a Public component, if we ever
need to use them in more than one component.

Public components should be treated like a semantically versioned API, and a PR
should mention any time that the component's properties are changed in a way
that might affect other components.

## Folder Structure

Each `Public` component should have a folder in `./app/components/`, matching the name
and capitalization of the component. Each component should have its own supporting
documentation, examples, and tests.

```
/* Inside ./app/components/MyPublicComponent/ */
index.jsx // MyPublicComponent as the default export
styles.scss // Styles for MyPublicComponent and children
spec.jsx // Test for MyPublicComponent
stories.jsx // Examples
README.md // Documentation
PrivateComponent/index.jsx // Component used only within MyPublicComponent
PrivateComponent/styles.scss // Styles for PrivateComponent and children
PrivateComponent/spec.jsx // Test for PrivateComponent
PrivateComponent/stories.jsx // Examples
PrivateComponent/README.md // Documentation
```

The name used for imports and exports should always match the folder or filename:

* `./MyPublicComponent/index.jsx`
 * Default export is a component named `MyPublicComponent`
 * Imported as `import MyPublicComponent from './app/components/MyPublicComponent';`
* `./MyPublicComponent/PrivateComponent/index.jsx`
 * Default export is a component named `PrivateComponent`
 * Imported as `import PrivateComponent from './PrivateComponent';`

## State

There are three areas where we may track the current visualization settings:

* Redux (Global application state)
* Component state
* Component properties

As a general rule of thumb, the following steps will define the best location:

* If this data affects the screenshot or sharing: Redux
* If this data is used by multiple components that aren't parents/children of each other: Redux
* If this component or its children should rerender when it changes
 * If this data changes multiple times per second: Potentially property that debounces to state
  * Caution should be used, as this may result in race conditions and render bugs. Always discuss this with the team first
 * If this data changes less than once a second: Component state

When a component needs state that is stored within Redux, it will be passed in
as props from the parent component (in most cases this will be a View).

## CSS

Any styles that are required to display the component outside of the visualization
should be added to a `styles.scss` file and imported into any files within the
component folder that make use of it. All declarations within `styles.scss`
should be grouped in a single class that is only used by this component.

```css
/* app/components/CompanyWheel/styles.scss */
.company-wheel {
  .company-name {
    font-weight: bold;
  }

  .pull-to-spin {
    position: absolute;
    top: 0;
    right: 0;
  }
}
```

## PropTypes

PropTypes should be added to props to reduce bugs in component usage.

## Documentation

Each component should have a `README.md` to explain what the component is used
for, and what its interaction, analytics, and accessibility requirements are,
with reference links back to the design document.
