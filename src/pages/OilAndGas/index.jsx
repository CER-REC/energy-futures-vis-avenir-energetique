import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import YearSlider from '../../components/YearSlider';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';

const useStyles = makeStyles({
  cellsTop: {
    borderBottom: '0',
    minWidth: 0,
    verticalAlign: 'bottom',
  },
  cellsBottom: {
    borderBottom: '0',
    minWidth: 0,
    verticalAlign: 'top',
  },
  years: {},
  treeMapCollection1: {},
  treeMapCollection2: {},
  slider: {},
});

const OilAndGas = ({ data, year }) => {
  const classes = useStyles();
  const { config } = useConfig();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [compareYear, setCompareYear] = useState(currentYear);

  const { regions: { colors: regionColors } } = useAPI();

  // Compare button toggle
  const [compare, setCompare] = useState(false);

  if (!data) {
    return null;
  }

  /**
   * Format tooltip.
   */
  // const getTooltip = useCallback(event => (
  //   <VizTooltip
  //     nodes={event.slice?.points.map(value => ({
  //       name: value.serieId,
  //       translation: intl.formatMessage({ id: `common.sources.energy.${value.serieId}` }),
  //       value: value.data?.y,
  //       color: value.serieColor,
  //     }))}
  //     unit={config.unit}
  //     paper
  //   />
  // ), [config.unit]);

  // Sorted datasets. Can be improved
  const currentYearData = data[currentYear].length > 1 ? data[currentYear]
    .sort((a, b) => b.total - a.total) : data[currentYear];

  const compareYearData = data[compareYear].length > 1 ? data[compareYear]
    .sort((a, b) => b.total - a.total) : data[compareYear];

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
    C5: 'green',
  };

  const getBiggestTreeMapTotal = () => {
    if (compare) {
      return currentYearData[0].total > compareYearData[0].total
        ? currentYearData[0].total
        : compareYearData[0].total;
    }
    return currentYearData[0].total;
  };

  const sizeMultiplier = (total) => {
    /*
    This solution works pretty well with the exeption of very
    small charts. This will be solved when the small ones get grouped and
    magnified.
    */

    const biggestTreeMapTotal = getBiggestTreeMapTotal();
    const size = compare ? 250 : 450;

    if (!(total >= biggestTreeMapTotal)) {
      return size * (total / biggestTreeMapTotal);
    }

    return size;
  };

  const treeMapCollection = (treeData) => {
    // FIXME: there is an issue where if you deselect provinces, the query changes
    // and the total percentage is recalculated, making the percentage wrong
    const totalGrandTotal = treeData.reduce((acc, val) => acc + val.total, 0);

    return treeData.map((source) => {
      if (source.total <= 0) {
        return null;
      }

      const percentage = ((source.total / totalGrandTotal) * 100).toFixed(2);

      return (
        <Grid
          item
          key={source.name}
          style={{
            bottom: 0,
            height: sizeMultiplier(source.total) || 0,
            width: sizeMultiplier(source.total) || 0,
          }}
        >

          <Typography varient="body1" style={{ marginLeft: 10, bottom: 0 }}>
            {config.view === 'region' ? `${source.name}: ${percentage}%` : source.name}
          </Typography>

          <ResponsiveTreeMap
            root={source}
            tile='sliceDice'
            identity="name"
            value="value"
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            label={d => d.name}
            labelSkipSize={25}
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
      );
    });
  };

  return (
    <>
      <div style={{ position: 'absolute', right: 50 }}>

        <div>
          <div style={{ border: '4px solid black', height: 30, width: 30, display: 'inline-block', marginRight: 10 }} />

          <div style={{ display: 'inline-block' }}>
            <Typography color='primary' variant='h3'>
              {currentYear}
            </Typography>
          </div>
        </div>

        {compare && (
        <div>
          <div style={{ border: '4px dotted grey', height: 30, width: 30, display: 'inline-block', marginRight: 10 }} />
          <div style={{ display: 'inline-block' }}>
            <Typography color='secondary' variant='h3'>{compareYear}</Typography>
          </div>
        </div>
        )}
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
      </div>

      <TableContainer>
        <Table>
          <TableBody>
            <TableRow key="treeMapCollection1" className={classes.treeMapCollection1}>
              {treeMapCollection(currentYearData).map(treeMap => <TableCell align="right" className={classes.cellsTop}>{treeMap}</TableCell>)}
            </TableRow>
            <TableCell
              align="right"
              colSpan="100%"
            >
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
            </TableCell>

            {compare && (
            <TableRow key="treeMapCollection2" className={classes.treeMapCollection2}>
              {treeMapCollection(compareYearData).map(treeMap => <TableCell align="right" className={classes.cellsBottom}>{treeMap}</TableCell>)}
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
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
