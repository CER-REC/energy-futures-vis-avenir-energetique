# Horizontal Control Bar

This component provides a group of control interface allowing the user to select or change configurations such as the main selection, sector, view by, and unit. Content of the configurations are page-sensitive, i.e. different pages show different controls.

More specifically,
- By Region: main selection + unit
- By Sector: sector + unit
- Electricity: view by + unit
- Scenarios: main selection + unit
- Oil and Gas: main selection + view by + unit

## Usage

Component `HorizontalControlBar` does not expose any parameters, instead, it is fully driven by the current system configuration stored in the `useConfig` hook.

```jsx
<HorizontalControlBar />
```

In return, user events (button clicks) happen in the component will update the system configuration directly.

## Tip

Make sure `useConfig` is properly connected and the configuration setting is valid, especially during testing.

## Interactions

- None
