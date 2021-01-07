# Page Layout

This component defines the basic UI structure and the arrangement of components including (from top-left to bottom-right):
- main title
- year select
- download button
- page title
- scenario select
- horizontal control bar
- social media buttons
- draggable vertical list(s)
- context link buttons
- the visualization

Also `PageLayout` supports responsiveness, meaning the layout varies based on the screen resolution.

## Usage

Component `PageLayout` has a few parameters to control the visibility and functionality of the vertical lists; however, most of the behaviors are driven by the current system configuration stored in the `useConfig` hook.

```jsx
<PageLayout>{Viz}</PageLayout>
```

In return, user events (button clicks) happen in the component will update the system configuration directly.

## Tip

Make sure `useConfig` is properly connected and the configuration setting is valid, especially during testing.

## Interactions

- None
