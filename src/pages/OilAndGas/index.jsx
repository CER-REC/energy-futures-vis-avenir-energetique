import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Button, Tooltip, makeStyles } from '@material-ui/core';
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
    '& svg': { transform: 'rotate(270deg) scaleX(-1)' },
    '& > div > div > div:last-of-type': { display: 'none' }, // hide the default Nivo tooltip
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
  const { config, configDispatch } = useConfig();
  const intl = useIntl();

  const [currentYear, setCurrentYear] = useState(config.baseYear || year?.min);
  const [compareYear, setCompareYear] = useState(config.compareYear || year?.min);

  const {
    regions: { colors: regionColors },
    sources: { oil: { colors: oilColors }, gas: { colors: gasColors } },
  } = useAPI();

  // Compare button toggle
  const compare = useMemo(() => !config.noCompare, [config.noCompare]);

  // Determine which tooltip is currently open
  const [tooltip, setTooltip] = useState(undefined);

  /**
   * Determine the block colors in treemaps.
   */
  const getColor = useCallback((d) => {
    let color;
    if (config.view === 'source') {
      color = regionColors[d.name];
    } else {
      color = config.mainSelection === 'oilProduction' ? oilColors[d.name] : gasColors[d.name];
    }
    return color;
  }, [config.mainSelection, config.view, gasColors, oilColors, regionColors]);

  /**
   * Format tooltip.
   */
  const getTooltip = useCallback(entry => (
    <VizTooltip
      nodes={entry.children.map(value => ({
        name: value.name,
        translation: intl.formatMessage(
          {
            id: config.view === 'region'
              ? `common.sources.${config.mainSelection === 'oilProduction' ? 'oil' : 'gas'}.${value.name}`
              : `common.regions.${value.name}`,
          },
        ),
        value: value.value,
        color: getColor(value),
      }))}
      unit={config.unit}
    />
  ), [config, intl, getColor]);

  const sortDataSets = useCallback((curr, comp) => {
    // sort the current data in decending order
    const currentYearData = (curr || []).sort((a, b) => b.total - a.total);

    // set the sort order to be the current year order
    const sortOrder = currentYearData.map(item => item.name);

    // re-arrange the compare year data to match current year data
    const compareYearData = (sortOrder || []).map(item => comp.find(x => x.name === item));

    // removing entries that are zeros in both current and compare data
    const currentZeros = new Set(currentYearData.filter(d => d.total <= 0).map(d => d.name));
    const compareZeros = new Set(compareYearData.filter(d => d.total <= 0).map(d => d.name));

    const isNotBothZero = item => !currentZeros.has(item.name) || !compareZeros.has(item.name);

    return {
      currentYearData: currentYearData.filter(isNotBothZero),
      compareYearData: compareYearData.filter(isNotBothZero),
    };
  }, []);

  const getBiggestTreeMapTotal = useCallback((curr, comp) => {
    const currLargest = Math.max(...curr.map(item => item.total));
    const compLargest = Math.max(...comp.map(item => item.total));

    if (compare) {
      return currLargest > compLargest
        ? currLargest
        : compLargest;
    }
    return currLargest;
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

  const createTreeMap = useCallback((
    sortedSource, percentage, size, isTopChart, biggestTreeMapTotal,
  ) => (
    <>
      <Typography align='center' varient="body2" style={{ bottom: 0, fontWeight: 700, fontSize: 12 }}>
        {config.view === 'source' ? intl.formatMessage(
          {
            id: `views.oil-and-gas.treeMapSourceTitles.${config.mainSelection}.${sortedSource.name}`,
            defaultMessage: sortedSource.name,
          },
        ) : sortedSource.name}
        {config.view === 'region' && percentage > 1 && `: ${percentage.toFixed(2)}%`}
      </Typography>

      <Tooltip
        open={sortedSource.name === tooltip}
        title={getTooltip(sortedSource)}
        placement={(compare && isTopChart) ? 'top' : 'bottom'}
        onOpen={() => setTooltip(sortedSource.name)}
        onClose={() => setTooltip(undefined)}
      >
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
            tile="binary"
            identity="name"
            value="value"
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            enableLabel={false}
            colors={getColor}
            borderWidth={1}
            borderColor="white"
            animate
            motionStiffness={90}
            motionDamping={11}
            leavesOnly
          />
        </div>
      </Tooltip>
    </>
  ), [
    classes.treeMapRectangle, config.view, config.mainSelection,
    tooltip, compare, getColor, getTooltip, sizeMultiplier, intl,
  ]);

  if (!data || Number.isNaN(data[currentYear][0].total)) {
    return null;
  }

  const biggestTreeMapTotal = getBiggestTreeMapTotal(data[currentYear], data[compareYear]);

  // Sorted datasets
  const {
    currentYearData,
    compareYearData,
  } = sortDataSets(data[currentYear], data[compareYear]);

  const treeMapCollection = (treeData, isTopChart) => {
    const totalGrandTotal = treeData.reduce((acc, val) => acc + val.total, 0);
    const size = getSizeNumber(treeData);
    const regularTreeMaps = [];
    const smallTreeMaps = [];

    const names = treeData.map((source) => {
      // Its easier to sort the sources when they come in.
      // This is not very efficient however.
      const sortedSource = {
        name: source.name,
        total: source.total,
        children: source.children.sort((a, b) => b.value - a.value),
      };

      const percentage = (sortedSource.total / totalGrandTotal) * 100;
      const args = [sortedSource, percentage, size, isTopChart, biggestTreeMapTotal];

      if (percentage <= 0) {
        regularTreeMaps.push(0); // empty cell
      }
      if (percentage > 0 && percentage <= 1) {
        smallTreeMaps.push(createTreeMap(...args));
      }
      if (percentage > 1) {
        regularTreeMaps.push(createTreeMap(...args));
      }
      return source.name;
    });

    // removing trailing zeros
    while (regularTreeMaps[regularTreeMaps.length - 1] <= 0) {
      regularTreeMaps.pop();
    }
    while (smallTreeMaps[smallTreeMaps.length - 1] <= 0) {
      smallTreeMaps.pop();
    }

    if (regularTreeMaps.length === 0) {
      return null;
    }

    return (
      <TableRow>
        {regularTreeMaps.map((tree, i) => (tree ? (
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
        ) : <TableCell key={`treemap-${names[i]}`} />))}
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
            {/* This may be re-implemented in the future */}
            {/* <Grid item className={classes.yearBox}>
              <div style={{ border: '3px solid black' }} />
            </Grid> */}
            <Grid item>
              <Typography color='primary' variant='h4' style={{ padding: '0px 20px' }}>
                {currentYear}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {compare && (
          <Grid item>
            <Grid container alignItems="center" wrap="nowrap" spacing={1}>
              {/* This may be re-implemented in the future */}
              {/* <Grid item className={classes.yearBox}>
                <div style={{ border: '3px dotted grey' }} />
              </Grid> */}
              <Grid item>
                <Typography color='secondary' variant='h4' style={{ padding: '0px 20px' }}>
                  {compareYear}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item>
          <Button variant="outlined" color="primary" size="small" onClick={() => configDispatch({ type: 'noCompare/changed', payload: compare })}>
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
                  forecast={year.forecastStart}
                />
              </TableCell>
            </TableRow>

            {compare && compareTreeMapCollection}

          </TableBody>
        </Table>
      </TableContainer>

      {/* legend */}
      <Grid container direction="column" className={classes.legend}>
        <Typography align='center' variant='body2'><strong>Legend</strong></Typography>

        <Typography variant="body2" align="center">
          <strong>{intl.formatMessage({ id: `common.oilandgas.legend.${config.mainSelection}.${config.view}.title` })}</strong>
        </Typography>

        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item><IconOilAndGasRectangle /></Grid>
          <Grid item>
            <Typography variant="body2">
              {intl.formatMessage({ id: `common.oilandgas.legend.${config.mainSelection}.${config.view}.single` })}
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item><IconOilAndGasGroup /></Grid>
          <Grid item>
            <Typography variant="body2">
              {intl.formatMessage({ id: `common.oilandgas.legend.${config.mainSelection}.${config.view}.group` })}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

OilAndGas.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  year: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    forecastStart: PropTypes.number,
  }),
};

OilAndGas.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0, forecastStart: 0 },
};
export default OilAndGas;
