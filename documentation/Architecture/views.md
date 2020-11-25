# Views

Views will typically have very little functionality, and will handle a
limited number of tasks:

* Connect Redux state and actions to components
* Handle the layout and interaction of components
* Handle animation when changing views

As with Components, these should always be written in a pure way
(`extends React.PureComponent`)

Views should be stored in `app/views/ViewName/`.

## Folder Structure

Each view should have a folder in `./app/views/`, matching the name
and capitalization of the view component. Each view should have its own
supporting documentation, examples, and tests.

```
/* Inside ./app/views/ViewName/ */
index.jsx // ViewName as the default export
styles.scss // Styles for ViewName and children
spec.jsx // Test for ViewName
stories.jsx // Examples
README.md // Documentation
```

Unlike `Components`, a `View` may not have any private components within it.
Any functionality it needs for rendering should be imported from a `Component`.

When importing `ViewName`, the import should be written as:

```js
import ViewName from '../views/ViewName';
```

## State

As views are primarily for layout and connecting data, they should not
have their own state in most cases.

## CSS

Any styles that are required to display the view should be added to a
`styles.scss` file and imported into `index.jsx`.  All declarations within
`styles.scss` should be grouped in a single class that is only used by this
view. These styles may be used to override a component's default styles for
this specific implementation.

```css
/* app/views/View2/styles.scss */
.View2 {
  .projectMenu .list .active {
    margin-left: 10px;
  }
}
```

## PropTypes

PropTypes should be added to props to reduce bugs in component usage.

## Documentation

Each view should have a `README.md` to explain what components are being
used, and what its interaction, analytics, and accessibility requirements are,
with reference links back to the design document.
