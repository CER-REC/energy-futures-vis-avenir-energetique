import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';
import useConfig from '../../hooks/useConfig';
import useAPI from '../../hooks/useAPI';
import YearSlider from '../../components/YearSlider';

const TreeMapCollection = ({ data, showSourceLabel }) => {
  const { regions: { colors: regionColors } } = useAPI();
  const { config } = useConfig();

  if (!data) {
    return null;
  }

  // the oil and gas colors are not yet availible
  const tempColors = {
    ALL: 'white',
    CBM: 'red',
    OIL: 'blue',
    TIGHT: 'pink',
    NA: 'orange',
    SHALE: 'yellow',
    SOLUTION: 'green',
    MB: 'red',
    ISB: 'blue',
    HEAVY: 'pink',
    LIGHT: 'orange',
    CONDENSATE: 'yellow',
    C_5: 'green',
  };

  // bySource needs to be a bit bigger, because some sources are very small.
  const sizeMultiplier = () => {
    let multiplier = 1;
    if (config.mainSelection === 'oilProduction') {
      multiplier = 0.1;
    }
    return multiplier;
  };

  // Sort data by largest total
  const sortedData = data.length > 1 ? data
    .sort((a, b) => b.total - a.total) : data;

  // FIXME: there is an issue where if you deselect provinces, the query changes
  // and the total percentage is recalculated, making the percentage wrong
  const totalGrandTotal = sortedData.reduce((acc, val) => acc + val.total, 0);

  const trees = sortedData.map((source) => {
    if (source.total <= 0) {
      return null;
    }

    const percentage = ((source.total / totalGrandTotal) * 100).toFixed(2);

    return (
      <Grid container spacing={8} wrap="nowrap">
        <Grid
          item
          key={source.name}
          style={{
            bottom: 0,
            height: source.total * sizeMultiplier(),
            width: source.total * sizeMultiplier(),
          }}
        >

          {showSourceLabel && <Typography style={{ marginLeft: 10, bottom: 0 }}>{`${source.name}: ${percentage}%`}</Typography>}
          <ResponsiveTreeMap
            root={source}
            identity="name"
            value="value"
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            label={d => d.name}
            labelSkipSize={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
            colors={d => (config.view === 'source'
              ? regionColors[d.name]
              : tempColors[d.name])}
            borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
            animate
            motionStiffness={90}
            motionDamping={11}
          />

        </Grid>
      </Grid>
    );
  });
  return trees;
};

const OilAndGas = ({ data, year }) => {
  const { config } = useConfig();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [compareYear, setCompareYear] = useState(currentYear);

  // Compare button toggle
  const [compare, setCompare] = useState(false);

  if (!data) {
    return null;
  }

  return (
    <Grid container style={{ height: '100%' }}>

      <Grid style={{ marginLeft: '80%', align: 'right' }}>
        <Typography variant='h3'>{currentYear}</Typography>
        {compare
        && <Typography variant='h3'>{compareYear}</Typography>}
        <Button
          onClick={() => setCompare(!compare)}
          variant="outlined"
          style={{ marginTop: '10px' }}
        >
          <Typography
            variant='body1'
          >{compare ? "Don't Compare" : 'compare'}
          </Typography>
        </Button>
      </Grid>

      <Grid container wrap="nowrap">
        <TreeMapCollection
          data={data[currentYear]}
          showSourceLabel
          selectedYear={currentYear}
        />
      </Grid>

      <Grid container wrap="nowrap" style={{ marginTop: 15 }}>
        <YearSlider
          year={compare ? { curr: currentYear, compare: compareYear } : currentYear}
          onYearChange={(value) => {
            if ((value.curr || value) !== currentYear) {
              setCurrentYear(value.curr || value);
            } if (compare && value.compare !== compareYear) {
              setCompareYear(value.compare);
            }
          }}
          min={year.min}
          max={year.max}
        />
      </Grid>

      {compare
      && (
      <Grid container wrap="nowrap">
        <TreeMapCollection
          data={data[compareYear]}
          selectedYear={compareYear}
          showSourceLabel={config.view === 'region'}
        />
      </Grid>
      )}

    </Grid>
  );
};

OilAndGas.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
};

OilAndGas.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};
export default OilAndGas;
