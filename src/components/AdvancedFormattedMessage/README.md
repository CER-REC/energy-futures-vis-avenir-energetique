# Advanced Formatted Message

This utility component provides a wrapper for `react-intl.FormattedMessage`, reducing the amount of boilerplate required to apply custom classes or render logic.

## Usage

```jsx
<AdvancedFormattedMessage
  id="some.locale.id"
  className="highlight"
/>
```

is equivalent to:

```jsx
<FormattedMessage
  id="some.locale.id"
>
  {text => <span className="highlight">{text}</span>}
</FormattedMessage>
```

All props other than `id`, `values`, and `tag` are passed straight down to the rendered child:

```jsx
<AdvancedFormattedMessage
  id="some.locale.id"
  values={{
    a: "a",
    locale: "locale",
    value: "value",
  }}
  tag={SomeComponent}

  someComponentProp1="hello"
  someComponentProp2="world"
/>
```

## Performance Tips

There are a few best-practices that can significantly reduce or eliminate wasted renders, applicable to both this component and the standard `<FormattedMessage>`.

### Pre-declaring value objects

Declaring a `values` prop inline will result in it being recreated on every render. By itself this isn't significant, but across a large app with many components it can become an issue and - at the very least - is an easy-enough thing to avoid.

#### Don't

```jsx
<AdvancedFormattedMessage
  id="some.locale.id"
  values={{
    a: "a",
    locale: "locale",
    value: "value",
  }}
/>
```

#### Do

```jsx
const values = { a: "a", locale: "locale", value: "value" };

<AdvancedFormattedMessage
  id="some.locale.id"
  values={values}
/>
```

### Pre-declaring render functions

As with value objects, declaring a child function inline will result in it being recreated on every render.

#### Don't

```jsx
<AdvancedFormattedMessage
  id="some.locale.id"
  tag={({ children }) => <p>{children}</p>}
/>
```

#### Do

```jsx
const renderFn = ({ children }) => <p>{children}</p>;

<AdvancedFormattedMessage
  id="some.locale.id"
  tag={renderFn}
/>
```

### Memoizing components that depend on props

Having React cache previous instances of a component can have a significant effect on performance, and at a fairly minimal memory cost unless the component is frequently given new and unique props.

#### Don't

```jsx
// eslint-disable-next-line react/prop-types
const ChildComponent = ({ children, suffix }) => (
  <div>{children}{suffix}</div>
);

<AdvancedFormattedMessage
  id="some.locale.id"
  tag={ChildComponent}
  suffix={props.suffix}
/>
```

#### Do

```jsx
// eslint-disable-next-line react/prop-types
const ChildComponent = React.memo(({ children, suffix }) => (
  <div>{children}{suffix}</div>
));

<AdvancedFormattedMessage
  id="some.locale.id"
  tag={ChildComponent}
  suffix={props.suffix}
/>
```
