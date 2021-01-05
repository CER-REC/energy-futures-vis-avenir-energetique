# Link Button Group

This component renders context link buttons situated at the bottom-left corner and contains the following buttons:
- EF2020 Report
- Methodology
- About

in which the `EF2020 Report` button opens a tabbed panel that has the following sub-panels:
- Summary
- Key Findings
- Assumptions
- Results

## Usage

Component `LinkButtonGroup` renders based on the `yearId` stored in the `useConfig` hook.

```jsx
<LinkButtonGroup direction="row" />
```

## Requirements

- [x] Renders the Link Button Group component
- [x] Renders the corresponding panels
- [x] Renders the tabbed sub-panels when clicking on the `EF2020 Report` button

## Interactions

- None
