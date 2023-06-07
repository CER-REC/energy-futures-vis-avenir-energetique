# Year Slice Tooltip

This component is used as a generic panel that displays a list of node values (color, label, value, and percentage). It can be used as a stand-alone component or rendered inside visualization tooltips.

This component will always display a single year worth of information, and should be provided.

The content of the panel is defined by the `sections` parameter. Within the sections parameter, a list of sections can be given to display multiple sections on a tooltip. In a section, the `title`, a set of `nodes`, and the `unit` are required. It can also show the total of the values, price and percentage within the tooltip.

Within each section, a `name`, `value` and `color` for each node should be provided, and a mask is optional.

## Usage

```jsx
<YearSliceTooltip sections={[{title: 'title', nodes: [{ name: 'Biomass / Geothermal', value: 1725.168, color: '#1C7F24' }], unit: "kilobarrelEquivalents"}]} year="2023" />
```

## Requirements

- [x] Renders the panel as a stand-alone component
- [x] Renders the panel when hovering on a chart / visualization

## Interactions

- None
