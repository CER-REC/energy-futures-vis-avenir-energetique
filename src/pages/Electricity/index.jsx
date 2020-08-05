import React, { useMemo } from 'react';
import { ResponsiveBubble } from '@nivo/circle-packing';
import data from './data';
import { REGION_ORDER } from '../../types';

const DEFAULT = REGION_ORDER.reduce((result, province) => ({
  ...result,
  [province]: {
    oilProducts: { name: 'oilProducts', color: '#B56696', value: 0 },
    nuclear: { name: 'nuclear', color: '#CBCA44', value: 0 },
    bio: { name: 'bio', color: '#8468A9', value: 0 },
    naturalGas: { name: 'naturalGas', color: '#D5673E', value: 0 },
    coal: { name: 'coal', color: '#8C6639', value: 0 },
    solarWindGeothermal: { name: 'solarWindGeothermal', color: '#60984D', value: 0 },
    hydro: { name: 'hydro', color: '#4F67AE', value: 0 },
  },
}), {});

const Electricity = () => {
  const processedData = useMemo(() => {
    (data || []).filter(entry => entry.year === 2005).forEach(entry => {
      if (DEFAULT[entry.province] && DEFAULT[entry.province][entry.source]) {
        DEFAULT[entry.province][entry.source].value += entry.value;
      }
    });

    return REGION_ORDER.map(province => ({
      name: province,
      color: '#FFF',
      children: Object.values(DEFAULT[province]),
    }));
  }, []);

  if (!data) {
    return null;
  }

  return (
    <ResponsiveBubble
      root={{ name: 'root', color: '#FFF', children: processedData }}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      identity="name"
      value="value"
      colors={d => d.color}
      colorBy="name"
      padding={4}
      borderWidth={1}
      borderColor={d => d.color === 'rgb(255,255,255)' ? '#666' : d.color}
      enableLabel={false}
      tooltip={t => t.data.value && `${t.data.name} (2005) ${(t.data.value / 1000).toFixed(2)} k GW.h`}
      isZoomable={false}
      animate={true}
      motionStiffness={90}
      motionDamping={12}
    />
  );
};

export default Electricity;
