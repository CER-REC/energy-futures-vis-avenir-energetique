# Visualization Tooltip

This component is used as a generic panel that displays a list of node values (color, label, value, and percentage). It can be used as a stand-alone component or rendered inside viz tooltips (therefore the name of the component).

The content of the panel is defined by the `nodes` parameter, in which `name` and `value` are mandatory while corresponding colors and i18n translations will be shown if available. The `VizTooltip` component also sums up a total value and then calculates the proportion of each node in percentages. In addition, the number and text format in the `VizTooltip` component are localized based on the current language in use.

## Usage

```jsx
<VizTooltip nodes={[...{ name: 'BIO', value: 1725.168, color: '#1C7F24', translation: 'Biomass / Geothermal' }]} unit="kilobarrelEquivalents" />
```

## Requirements

- [x] Renders the panel as a stand-alone component
- [x] Renders the panel when hovering on a chart / visualization

## Interactions

- None
