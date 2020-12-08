# Hint

This component renders a "help" icon button. Clicking on the icon button results in a dialog which contains predefined text messages. The `Hint` component serves as a generic plugin to places where help messages are needed.

The current implementation does not expose the raw `Hint` component directly, instead, it is always attached with specific content and wrapped in corresponding components.

An internal `HintSection` component is used to construct the layout of each content section inside the dialog pop-up.

## Usage

Component `Hint` uses a few parameters to specify the title and preferred size of the dialog pop-up, along with the content inside.

```jsx
<Hint label="unit" content={[<HintSection />, <HintSection />, ...]} maxWidth="md">{children}</Hint>
```

## Interactions

- None
