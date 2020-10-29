import React, { useState, useCallback, useMemo } from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { useIntl } from 'react-intl';
import YearSlider from '../../components/YearSlider';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import VizTooltip from '../../components/VizTooltip';

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

const OilAndGas = ({ data, year }) => {
  const classes = useStyles();
  const { config } = useConfig();
  const intl = useIntl();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [compareYear, setCompareYear] = useState(currentYear);

  const { regions: { colors: regionColors } } = useAPI();

  // Compare button toggle
  const [compare, setCompare] = useState(false);

  /**
   * Format tooltip.
   */
  const getTooltip = useCallback(event => (
    <VizTooltip
      nodes={event.parent?.children.map(value => ({
        name: value.id,
        translation: intl.formatMessage(
          { id: `common.sources.${config.mainSelection === 'oilProduction' ? 'oil' : 'gas'}.${value.id}` },
        ),
        value: value.value,
        color: value.color,
      }))}
      unit={config.unit}
      paper
    />
  ), [config, intl]);

  const getYearData = useCallback((inputData, dataYear) => {
    // This basically just filters and sorts the top level data
    // This sorting should be moved into parseData
    if (!inputData) {
      return [];
    }
    return (inputData[dataYear].length > 1)
      ? inputData[dataYear]
        .sort((a, b) => b.total - a.total)
        .filter(entry => entry.total > 0)
      : inputData[dataYear];
  }, []);

  const getBiggestTreeMapTotal = useCallback((curr, comp) => {
    // Finds the biggest treeMap
    if (compare) {
      return curr[0].total > comp[0].total
        ? curr[0].total
        : comp[0].total;
    }
    return curr[0].total;
  }, [compare]);

  const getSizeNumber = useCallback((treeData) => {
    // Calculates the base size all the tree maps will start with.
    const bigChart = 450;
    const mediumChart = 230;
    const smallChart = 180;

    if (treeData[1]
      && (treeData[1].total > (treeData[0].total / 6) || compare)) {
      if (treeData.length > 4) {
        return smallChart;
      }
      return mediumChart;
    }
    return bigChart;
  }, [compare]);

  const sizeMultiplier = useCallback((total, size, biggestTreeMap) => {
    // Takes the base treeMap size, and multiplies it by how much smaller the total is
    // compared to the biggest one, giving it a size proportional to the biggest one.
    if (total < biggestTreeMap) {
      // This is so that really small numbers will show something
      if (size * (total / biggestTreeMap) < 30) {
        return 30;
      }
      return size * (total / biggestTreeMap);
    }
    return size;
  }, []);

  if (!data) {
    return null;
  }

  // Sorted datasets. Can be improved
  const currentYearData = getYearData(data, currentYear);
  const compareYearData = getYearData(data, compareYear);

  const biggestTreeMapTotal = getBiggestTreeMapTotal(currentYearData, compareYearData);

  const treeMapCollection = (treeData, isTopChart) => {
    // FIXME: there is an issue where if you deselect provinces, the query changes
    // and the total percentage is recalculated, making the percentage wrong
    const totalGrandTotal = treeData.reduce((acc, val) => acc + val.total, 0);
    const size = getSizeNumber(treeData);

    return treeData.map((source) => {
      if (source.total <= 0) {
        return null;
      }
      // Its easier to sort the sources when they come in.
      // This is not very efficient however.
      const sortedSource = source.children.length > 1 ? {
        name: source.name,
        total: source.total,
        children: source.children
          .sort((a, b) => b.value - a.value),
      } : source;

      const percentage = ((sortedSource.total / totalGrandTotal) * 100).toFixed(2);

      return (
        <Grid
          item
          key={sortedSource.name}
          style={{
            bottom: 0,
            height: sizeMultiplier(sortedSource.total, size, biggestTreeMapTotal) || 0,
            width: sizeMultiplier(sortedSource.total, size, biggestTreeMapTotal) || 0,
          }}
        >
          {!isTopChart && <div style={{ borderLeft: '1px dashed black', height: 20 }} />}

          <Typography align='center' varient="body1" style={{ bottom: 0 }}>
            {config.view === 'region' ? `${sortedSource.name}: ${percentage}%` : sortedSource.name}
          </Typography>

          <ResponsiveTreeMap
            key={sortedSource.name}
            root={sortedSource}
            tile='sliceDice'
            identity="name"
            value="value"
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            enableLabel={false}
            colors={d => (config.view === 'source'
              ? regionColors[d.name]
              : tempColors[d.name])}
            borderWidth={2}
            borderColor="white"
            animate
            motionStiffness={90}
            motionDamping={11}
            tooltip={getTooltip}
          />

          {isTopChart && <div style={{ borderLeft: '1px dashed black', height: 10 }} />}

        </Grid>
      );
    });
  };

  return (
    <>
      <div style={{ position: 'absolute', right: 50, maxWidth: '100%' }}>

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
      <div style={{ marginTop: compare ? 120 : 150 }}>

        <TableContainer>
          <Table>
            <TableBody>

              <TableRow key="treeMapCollection1" className={classes.treeMapCollection1}>
                {treeMapCollection(currentYearData || [], true).map(treeMap => (
                  <TableCell
                    key={treeMap.name}
                    align="right"
                    className={classes.cellsTop}
                  >{treeMap}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow key="yearSlider">
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
              </TableRow>

              {compare && (
              <TableRow key="treeMapCollection2" className={classes.treeMapCollection2}>
                {treeMapCollection(compareYearData || [], false).map(treeMap => (
                  <TableCell
                    key={treeMap.name}
                    align="right"
                    className={classes.cellsBottom}
                  >{treeMap}
                  </TableCell>
                ))}
              </TableRow>
              )}

            </TableBody>
          </Table>
        </TableContainer>
      </div>
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
