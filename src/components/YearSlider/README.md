# Year Slider

This component is used as the auto-playable slider for year selection. If a single year number is passed in then only the base year thumb will show over the slider; however, passing a structure of `{ curr: [number], compare: [number] }` results in both the base year thumb (blue) and the compare year thumb (grey; under the slider). Only the base year supports auto-play.

## Usage

Component `YearSlider` depends on the `useConfig` hook.

```jsx
<YearSlider year={2020} />
```

## Tip

Make sure `useConfig` is properly connected and the configuration setting is valid, especially during testing.

## Requirements

- [x] Renders year slider
- [x] Renders the auto-play / pause button
- [x] Renders the 2nd year slider for comparison if necessary

## Interactions

- Slide the base year thumb (or the compare year thumb) on the slider to watch how the internal `year` object updates.
