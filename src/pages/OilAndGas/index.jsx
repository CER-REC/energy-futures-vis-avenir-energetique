import React, { useState, useCallback } from 'react';

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

const useStyles = makeStyles(theme => ({
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
}));

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

  if (!data) {
    return null;
  }

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

  const treeMapCollection = (treeData) => {
    // remove any entries with zero values
    const filteredTreeData = treeData.filter(entry => entry.total > 0);

    // FIXME: there is an issue where if you deselect provinces, the query changes
    // and the total percentage is recalculated, making the percentage wrong
    const totalGrandTotal = filteredTreeData.reduce((acc, val) => acc + val.total, 0);

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

      const getSizeNumber = () => {
        const bigChart = 450;
        const mediumChart = 230;
        const smallChart = 180;

        if (filteredTreeData[1]
          && (filteredTreeData[1].total > (filteredTreeData[0].total / 6) || compare)) {
          if (filteredTreeData.length > 4) {
            return smallChart;
          }

          return mediumChart;
        }

        return bigChart;
      };

      const biggestTreeMapTotal = getBiggestTreeMapTotal();

      const size = getSizeNumber();

      if (total < biggestTreeMapTotal) {
        // This is so that really small numbers will show something
        if (size * (total / biggestTreeMapTotal) < 30) {
          return 30;
        }
        return size * (total / biggestTreeMapTotal);
      }

      return size;
    };

    return filteredTreeData.map((source) => {
      const sortedSource = source.children.length > 1 ? {
        name: source.name,
        total: source.total,
        children: source.children
          .sort((a, b) => b.value - a.value),
      } : source;

      if (sortedSource.total <= 0) {
        return null;
      }

      const percentage = ((sortedSource.total / totalGrandTotal) * 100).toFixed(2);
      return (
        <Grid
          item
          key={sortedSource.name}
          style={{
            bottom: 0,
            height: sizeMultiplier(sortedSource.total) || 0,
            width: sizeMultiplier(sortedSource.total) || 0,
          }}
        >

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
                {treeMapCollection(currentYearData).map(treeMap => (
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
                {treeMapCollection(compareYearData).map(treeMap => (<TableCell key={treeMap.name} align="right" className={classes.cellsTop}>{treeMap}</TableCell>
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
