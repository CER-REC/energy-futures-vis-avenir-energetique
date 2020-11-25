// @ts-check
import React, { useEffect, useState } from 'react';
import Rose from './Rose';
import data from './data/data';

const SunBurstChart = () => {
  const [allRoses, allRosesSet] = useState(null);

  const updateRoses = () => {
    allRosesSet(Object.keys(data).map(province => <Rose key={`rose-vis-${province}`} provinceData={data[province]} />));
  };

  useEffect(() => {
    if (!allRoses) {
      updateRoses();
    }
  }, [allRoses]);

  return allRoses;
};

export default SunBurstChart;
