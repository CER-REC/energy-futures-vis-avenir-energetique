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
import { IconOilAndGasGroup, IconOilAndGasRectangle } from '../../icons';

const useStyles = makeStyles(theme => ({
  year: {
    position: 'absolute',
    top: 6,
    right: 16,
    width: 'min-content',
    '& button': {
      height: 'auto',
      width: '100%',
    },
  },
  yearBox: {
    '& > div': {
      height: 26,
      width: 26,
    },
    '& + * h4': { fontWeight: 700 },
  },
  cellsTop: {
    borderBottom: '0',
    minWidth: 0,
    verticalAlign: 'bottom',
    padding: 10,
  },
  cellsBottom: {
    borderBottom: '0',
    minWidth: 0,
    verticalAlign: 'top',
    padding: 10,
  },
  treeMapRectangle: {
    '& svg': { transform: 'rotate(270deg)' },
  },
  group: {
    border: `1px solid ${theme.palette.secondary.main}`,
    '& span': { lineHeight: 1.2 },
  },
  tick: {
    height: 20,
    marginLeft: 'calc(50% - 0.5px)',
    borderLeft: `1px dashed ${theme.palette.secondary.main}`,
  },
  legend: {
    float: 'right',
    width: 'max-content',
    margin: theme.spacing(1.5),
    padding: theme.spacing(1),
    backgroundColor: '#F3EFEF',
  },
}));

const OilAndGas = ({ data, year }) => {
  const classes = useStyles();
  const { config } = useConfig();
  const intl = useIntl();

  const [currentYear, setCurrentYear] = useState(config.baseYear || year?.min);
  const [compareYear, setCompareYear] = useState(config.compareYear || year?.min);

  const {
    regions: { colors: regionColors },
    sources: { oil: { colors: oilColors }, gas: { colors: gasColors } },
  } = useAPI();

  // Compare button toggle
  const [compare, setCompare] = useState(true);

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
    const smallChart = 160;

    if (treeData[1]
      && (treeData[1].total > (treeData[0].total / 6) || compare)) {
      if (treeData.length > 4) {
        return smallChart;
      }
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

  const getColor = useCallback((d) => {
    let color;
    if (config.view === 'source') {
      color = regionColors[d.name];
    } else {
      color = config.mainSelection === 'oilProduction' ? oilColors[d.name] : gasColors[d.name];
    }
    return color;
  }, [config.mainSelection, config.view, gasColors, oilColors, regionColors]);

  const createTreeMap = useCallback((sortedSource, percentage, size, biggestTreeMapTotal) => (
    <>
      <Typography align='center' varient="body2" style={{ bottom: 0, fontWeight: 700, fontSize: 12 }}>
        {intl.formatMessage(
          {
            id: `views.oil-and-gas.treeMapSourceTitles.${config.mainSelection}.${sortedSource.name}`,
            defaultMessage: sortedSource.name,
          },
        )}
        {config.view === 'region' && percentage > 1 && `: ${percentage}%`}
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
          leavesOnly
        />
      </div>
    </>
  ), [classes.treeMapRectangle, config, getColor, getTooltip, intl, sizeMultiplier]);

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

    const names = treeData.map((source) => {
      if (source.total <= 0) {
        return source.name;
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
        smallTreeMaps.push(createTreeMap(sortedSource, percentage, size, biggestTreeMapTotal));
      } else {
        regularTreeMaps.push(createTreeMap(sortedSource, percentage, size, biggestTreeMapTotal));
      }
      return source.name;
    });

    if (regularTreeMaps.length === 0) {
      return null;
    }

    return (
      <TableRow>
        {regularTreeMaps.map((tree, i) => (
          <TableCell
            key={`treemap-${names[i]}`}
            className={isTopChart ? classes.cellsTop : classes.cellsBottom}
          >
            <Grid
              container
              direction="column"
              wrap="nowrap"
              spacing={1}
            >
              {!isTopChart && <Grid item className={classes.tick} />}
              <Grid item>{tree}</Grid>
              {(compare && isTopChart) && <Grid item className={classes.tick} />}
            </Grid>
          </TableCell>
        ))}
        {smallTreeMaps.length > 0 && (
          <TableCell
            className={isTopChart ? classes.cellsTop : classes.cellsBottom}
            style={{ width: 100 }}
          >
            <Grid
              container
              spacing={1}
              className={classes.group}
            >
              <Grid item xs={12}>
                <Typography variant="overline" align='center'>Values less than 1%</Typography>
              </Grid>
              {smallTreeMaps.map((tree, i) => (
                <Grid item xs={12} sm={6} key={`grouped-treemap-${names[i]}`}>{tree}</Grid>
              ))}
            </Grid>
          </TableCell>
        )}
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
      {/* year numbers and the compare button (top-right) */}
      <Grid container direction="column" className={classes.year}>
        <Grid item>
          <Grid container alignItems="center" wrap="nowrap" spacing={1}>
            <Grid item className={classes.yearBox}><div style={{ border: '3px solid black' }} /></Grid>
            <Grid item><Typography color='primary' variant='h4'>{currentYear}</Typography></Grid>
          </Grid>
        </Grid>
        {compare && (
          <Grid item>
            <Grid container alignItems="center" wrap="nowrap" spacing={1}>
              <Grid item className={classes.yearBox}><div style={{ border: '3px dotted grey' }} /></Grid>
              <Grid item><Typography color='secondary' variant='h4'>{compareYear}</Typography></Grid>
            </Grid>
          </Grid>
        )}
        <Grid item>
          <Button variant="outlined" color="primary" size="small" onClick={() => setCompare(!compare)}>
            {intl.formatMessage({ id: `common.oilandgas.button.${compare ? 'noCompare' : 'compare'}` })}
          </Button>
        </Grid>
      </Grid>

      {/* treemap graphs */}
      <TableContainer style={{ marginTop: compare ? 120 : 40, overflow: 'hidden' }}>
        <Table>
          <TableBody>

            {currentTreeMapCollection}

            <TableRow key="yearSlider">
              <TableCell colSpan="100%" style={{ border: 'none' }}>
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

      {/* legend */}
      <Grid container direction="column" className={classes.legend}>
        <Typography align='center'><strong>Legend</strong></Typography>

        <Typography variant="body2" align="center">
          <strong>
            {config.view === 'source'
              ? `Type of ${config.mainSelection === 'oilProduction' ? 'Oil' : 'Gas'}`
              : 'Region'}
          </strong> &#40;Year selected&#41;
        </Typography>

        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item><IconOilAndGasRectangle /></Grid>
          <Grid item>
            <Typography variant="body2">
              {intl.formatMessage({ id: `common.oilandgas.legend.single.${config.view}` })}
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item><IconOilAndGasGroup /></Grid>
          <Grid item>
            <Typography variant="body2">
              {intl.formatMessage({ id: `common.oilandgas.legend.group.${config.view}` })}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
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
