# Draggable Vertical List

This component is used as a control for selecting the regions and sources. It supports various parameters to alter the component in both functional and cosmetic ways.

In general the `DraggableVerticalList` component can be configured as a combination of the following options:
- enable vs. disable drag-n-drop; this can be visually distinguished by whether or not the grasp indicator is shown
- round vs. square of the node shape
- single- vs. multi-select

## Usage

Component `DraggableVerticalList`, in addition to the parameters, is driven by the current system configuration stored in the `useConfig` hook.
In return, the result will also update the corresponding configuration, more specifically the list and the selected list.

```jsx
<DraggableVerticalList
    title="Source"
    round
    disabled={props?.disabled || false}
    singleSelect={props?.singleSelect || false}
    sourceType="energy"
    items={['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']}
    itemOrder={['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']}
    defaultItems={{
    BIO: { color: '#1C7F24', label: 'Biofuels & Emerging Energy', icon: IconBiofuel },
    COAL: { color: '#4B5E5B', label: 'Coal, Coke & Coke Oven Gas', icon: IconCoal },
    ELECTRICITY: { color: '#7ACBCB', label: 'Electricity', icon: IconElectricity },
    GAS: { color: '#890038', label: 'Natural Gas', icon: IconGas },
    OIL: { color: '#FF821E', label: 'Oil Products', icon: IconOil },
    }}
    defaultItemOrder={['BIO', 'COAL', 'ELECTRICITY', 'GAS', 'OIL']}
/>
```

## Tip

Make sure `useConfig` is properly connected and the configuration setting is valid, especially during testing.

## Interactions

- None
