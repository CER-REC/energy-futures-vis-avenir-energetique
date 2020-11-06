import React, { useState, useCallback } from 'react';

import PropTypes from 'prop-types';
import { Typography, Button, makeStyles } from '@material-ui/core';
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
import { IconOilAndGasGroup, IconOilAndGasRectangle } from '../../icons';

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
  treeMapCollectionTop: {},
  treeMapCollectionBottom: {},
  slider: {},
  treeMapRectangle: {
    '& svg': { transform: 'rotate(270deg)' },
  },
});

const OilAndGas = ({ data, year }) => {
  const classes = useStyles();
  const { config } = useConfig();
  const intl = useIntl();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [compareYear, setCompareYear] = useState(currentYear);

  const {
    regions: { colors: regionColors },
    sources: { oil: { colors: oilColors }, gas: { colors: gasColors } },
  } = useAPI();

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
          {
            id: config.view === 'region'
              ? `common.sources.${config.mainSelection === 'oilProduction' ? 'oil' : 'gas'}.${value.id}`
              : `common.regions.${value.id}`,
          },
        ),
        value: value.value,
        color: value.color,
      }))}
      unit={config.unit}
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
    const bigChart = 230;
    const mediumChart = 230;
    const smallChart = 160;

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
    let returnValue = size;

    if (total < biggestTreeMap) {
      // This is so that really small numbers will show something
      if (size * (Math.sqrt(total / biggestTreeMap)) < 30) {
        returnValue = 30;
      } else {
        returnValue = size * (Math.sqrt(total / biggestTreeMap));
      }
    }
    if (!returnValue > 0) {
      return size;
    }
    return returnValue;
  }, []);

  const getColor = (d) => {
    let color;
    if (config.view === 'source') {
      color = regionColors[d.name];
    } else {
      color = config.mainSelection === 'oilProduction' ? oilColors[d.name] : gasColors[d.name];
    }
    return color;
  };

  // eslint-disable-next-line no-restricted-globals
  if (!data || isNaN(data[currentYear][0].total)) {
    return null;
  }

  // Sorted datasets
  const currentYearData = getYearData(data, currentYear);
  const compareYearData = getYearData(data, compareYear);

  const biggestTreeMapTotal = getBiggestTreeMapTotal(currentYearData, compareYearData);

  const treeMapCollection = (treeData, isTopChart) => {
    const totalGrandTotal = treeData.reduce((acc, val) => acc + val.total, 0);
    const size = getSizeNumber(treeData);
    const regularTreeMaps = [];
    const smallTreeMaps = [];

    // eslint-disable-next-line consistent-return
    treeData.forEach((source) => {
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

      if (percentage <= 1) {
        smallTreeMaps.push(
          <div style={{ display: 'inline-block' }} key={sortedSource.name}>

            <Typography varient="body1" style={{ bottom: 0, fontWeight: 700 }}>
              { sortedSource.name }
            </Typography>

            <div style={{
              height: sizeMultiplier(sortedSource.total, size, biggestTreeMapTotal) || 0,
              width: sizeMultiplier(sortedSource.total, size, biggestTreeMapTotal) || 0,
              margin: 'auto',
              textAlign: 'center',
            }}
            >
              <ResponsiveTreeMap
                key={sortedSource.name}
                root={sortedSource}
                tile='squarify'
                identity="name"
                value="value"
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                enableLabel={false}
                colors={getColor}
                borderWidth={2}
                borderColor="white"
                animate
                motionStiffness={90}
                motionDamping={11}
                tooltip={getTooltip}
              />
            </div>
          </div>,
        );
      } else {
        regularTreeMaps.push(
          <TableCell
            key={sortedSource.name}
            className={isTopChart ? classes.cellsTop : classes.cellsBottom}
          >
            {!isTopChart && <div style={{ marginLeft: 'calc(50% - 0.5px)', borderLeft: '1px dashed black', height: 20 }} />}

            <Typography align='center' varient="body1" style={{ bottom: 0, fontWeight: 700 }}>
              {config.view === 'region' ? `${sortedSource.name}: ${percentage}%` : sortedSource.name}
            </Typography>

            <div
              className={classes.treeMapRectangle}
              style={{
                textAlign: 'center',
                height: sizeMultiplier(sortedSource.total, size, biggestTreeMapTotal) || 0,
                width: sizeMultiplier(sortedSource.total, size, biggestTreeMapTotal) || 0,
                margin: 'auto',
              }}
            >

              <ResponsiveTreeMap
                key={sortedSource.name}
                root={sortedSource}
                // Using binary causes a bunch of warnings and errors about
                // width and height being NaN

                tile='binary'
                identity="name"
                value="value"
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                enableLabel={false}
                colors={getColor}
                borderWidth={2}
                borderColor="white"
                animate
                motionStiffness={90}
                motionDamping={11}
                tooltip={getTooltip}
              />
            </div>
            {(compare && isTopChart) && <div style={{ marginLeft: 'calc(50% - 0.5px)', borderLeft: '1px dashed black', height: 10 }} />}

          </TableCell>,
        );
      }
    });
    if (regularTreeMaps.length === 0) {
      return null;
    }

    return (
      <TableRow className={classes[`treeMapCollection${isTopChart ? 'Top' : 'Bottom'}`]} key={`treeMapCollection${isTopChart ? 'Top' : 'Bottom'}`}>
        {regularTreeMaps}
        <TableCell
          key="smallMaps"
          width='auto'
          className={isTopChart ? classes.cellsTop : classes.cellsBottom}
          style={{ width: 100 }}
        >
          {smallTreeMaps.length > 0 && (
            <>
              <Typography align='center'>Values less than 1%</Typography>
              <div style={{ border: '2px solid black', textAlign: 'center', marginTop: 10 }}>
                {smallTreeMaps}
              </div>
            </>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const currentTreeMapCollection = treeMapCollection(currentYearData || [], true);
  const compareTreeMapCollection = treeMapCollection(compareYearData || [], false);

  if (!currentTreeMapCollection && !compareTreeMapCollection) {
    return null;
  }

  return (
    <>
      <div style={{ position: 'absolute', right: 25, maxWidth: '100%' }}>

        <div>
          <div style={{ border: '4px solid black', height: 30, width: 30, display: 'inline-block', marginRight: 10 }} />
          <div style={{ display: 'inline-block' }}>
            <Typography color='primary' variant='h3' style={{ fontWeight: 700 }}>
              {currentYear}
            </Typography>
          </div>
        </div>

        {compare && (
        <div>
          <div style={{ border: '4px dotted grey', height: 30, width: 30, display: 'inline-block', marginRight: 10 }} />
          <div style={{ display: 'inline-block' }}>
            <Typography color='secondary' variant='h3' style={{ fontWeight: 700 }}>
              {compareYear}
            </Typography>
          </div>
        </div>
        )}
        <Button
          onClick={() => setCompare(!compare)}
          variant="outlined"
          color="primary"
          size="small"
          fullWidth
          style={{ marginTop: '10px' }}
        >

          <span style={{ fontWeight: 900 }}>{compare ? "Don't Compare" : 'compare'}</span>

        </Button>
      </div>
      <div style={{ marginTop: compare ? 120 : 150, marginBottom: 100 }}>

        <TableContainer>
          <Table>
            <TableBody>

              {currentTreeMapCollection}

              <TableRow key="yearSlider">
                <TableCell
                  align="right"
                  colSpan="100%"
                  style={{ border: 'none' }}
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

              {compare && compareTreeMapCollection}

            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ backgroundColor: '#F3F3F3', height: 'auto', width: 'auto', padding: 10, position: 'absolute', bottom: 5, right: 5 }}>
        <Typography align='center' style={{ fontWeight: 950, fontSize: 'medium' }}>Legend</Typography>

        <Typography align='center'>
          <span style={{ fontWeight: 900 }}>
            {config.view === 'source'
              ? `Type of ${config.mainSelection === 'oilProduction' ? 'Oil' : 'Gas'}`
              : 'Region'}
          </span> &#40;Year selected&#41;
        </Typography>

        <Typography align='left'>
          <IconOilAndGasRectangle style={{ marginRight: 5 }} />
          {config.view === 'region'
            ? 'Source: Amount of source produced in region (% of total in CAN)'
            : 'Region: Amount of source produced in region'}
        </Typography>

        <Typography align='left'>
          <IconOilAndGasGroup style={{ marginRight: 5 }} />
          {config.view === 'source'
            ? 'Source: Total amount of source produced in Canada'
            : 'Region: Total amount produced in region'}
        </Typography>

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
