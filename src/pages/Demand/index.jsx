// @ts-check
import React, { useEffect, useState } from 'react';
import Rose from './Rose';
import data from './data/data';
import PageLayout from '../../components/PageLayout';

const SunBurstChart = () => {
  const [allRoses, allRosesSet] = useState(null);

  const updateRoses = () => {
    allRosesSet(Object.keys(data).map(province => <Rose provinceData={data[province]} />));
  };

  useEffect(() => {
    if (!allRoses) {
      updateRoses();
    }
  });

  return <PageLayout showRegion>{allRoses}</PageLayout>;
};

export default SunBurstChart;
