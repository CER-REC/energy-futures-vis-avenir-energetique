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
    zIndex: 1,
    '& button': {
      height: 'auto',
      width: '100%',
    },
  },
  // yearBox: {
  //   '& > div': {
  //     height: 26,
  //     width: 26,
  //   },
  //   '& + * h4': { fontWeight: 700 },
  // },
  table: {
    overflow: 'hidden',
    marginTop: theme.spacing(8),
    '& > table': { position: 'relative' },
  },
  cell: {
    height: 300,
    minWidth: 0,
    padding: theme.spacing(1),
  },
  treeMapRectangle: {
    margin: 'auto',
    '& svg': { transform: 'rotate(270deg) scaleX(-1)' },
    '& > div > div > div:last-of-type': { display: 'none' }, // hide the default Nivo tooltip
  },
  group: {
    position: 'absolute',
    top: '50%',
    right: theme.spacing(2),
    width: 100,
    border: `1px solid ${theme.palette.secondary.main}`,
    '& span': { lineHeight: 1.2 },
  },
  label: {
    fontWeight: 700,
    fontSize: 12,
    lineHeight: 1.25,
  },
  tick: {
    height: 16,
    marginLeft: 'calc(50% - 0.5px)',
    borderLeft: `1px dashed ${theme.palette.secondary.main}`,
    '&:first-of-type': { marginBottom: theme.spacing(1.5) },
    '&:last-of-type': { marginTop: theme.spacing(1.5) },
  },
  legend: {
    float: 'right',
    width: 'max-content',
    margin: theme.spacing(1.5),
    padding: theme.spacing(1),
    backgroundColor: '#F3EFEF',
  },
}));

const MAX_SIZE = 250;

const OilAndGas = ({ data, year, vizDimension }) => {
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
      nodes={(entry.children || []).map(value => ({
        name: value.name,
        translation: intl.formatMessage({
          id: config.view === 'region'
            ? `common.sources.${config.mainSelection === 'oilProduction' ? 'oil' : 'gas'}.${value.name}`
            : `common.regions.${value.name}`,
        }),
        value: value.value,
        color: getColor(value),
      }))}
      unit={config.unit}
    />
  ), [config, intl, getColor]);

  /**
   * Sort both data based on the current year values in the descending order.
   */
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
      biggestValue: Math.max(0, ...[...currentYearData, ...compareYearData].map(d => d.total)),
    };
  }, []);

  /**
   * Generate the treemap component based on the source values, size and location (top or bottom).
   */
  const createTreeMap = useCallback((source, isTopChart, size) => (
    <>
      <Typography align='center' varient="body2" className={classes.label}>
        {config.view === 'source' ? intl.formatMessage({
          id: `views.oil-and-gas.treeMapSourceTitles.${config.mainSelection}.${source.name}`,
          defaultMessage: source.name,
        }) : source.name}
        {config.view === 'region' && source.percentage > 1 && `: ${source.percentage.toFixed(2)}%`}
      </Typography>

      <Tooltip
        open={source.name === tooltip}
        title={getTooltip(source)}
        placement={(compare && isTopChart) ? 'top' : 'bottom'}
        onOpen={() => setTooltip(source.name)}
        onClose={() => setTooltip(undefined)}
      >
        <div
          className={classes.treeMapRectangle}
          style={{ height: size, width: size }}
        >
          <ResponsiveTreeMap
            key={source.name}
            root={source}
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
    classes.treeMapRectangle, classes.label,
    config.view, config.mainSelection,
    tooltip, compare, getColor, getTooltip, intl,
  ]);

  // data not ready; render nothing
  if (!data || !data[currentYear] || !data[compareYear]) {
    return null;
  }

  // data content not valid; render nothing
  if (Number.isNaN(data[currentYear][0].total) || Number.isNaN(data[compareYear][0].total)) {
    return null;
  }

  // Sorted datasets
  const {
    currentYearData,
    compareYearData,
    biggestValue,
  } = sortDataSets(data[currentYear], data[compareYear]);

  const treeMapCollection = (treeData, isTopChart) => {
    if (!vizDimension.width || biggestValue <= 0) {
      return [];
    }

    const totalGrandTotal = treeData.reduce((acc, val) => acc + val.total, 0);
    const biggestRatio = Math.max(0, ...treeData.map(source => source.total)) / biggestValue;

    const regularTreeMaps = [];
    const smallTreeMaps = [];

    treeData.forEach((source) => {
      // Its easier to sort the sources when they come in.
      // This is not very efficient however.
      const sortedSource = {
        name: source.name,
        total: source.total,
        children: source.children.sort((a, b) => b.value - a.value),
      };

      const percentage = (sortedSource.total / totalGrandTotal) * 100;

      if (percentage <= 0) {
        regularTreeMaps.push(0); // empty cell
      }
      if (percentage > 0 && percentage <= 1) {
        smallTreeMaps.push({ ...sortedSource, percentage, width: Math.sqrt(percentage) });
      }
      if (percentage > 1) {
        regularTreeMaps.push({ ...sortedSource, percentage, width: Math.sqrt(percentage) });
      }
    });

    // removing trailing zeros
    while (regularTreeMaps[regularTreeMaps.length - 1] <= 0) {
      regularTreeMaps.pop();
    }
    while (smallTreeMaps[smallTreeMaps.length - 1] <= 0) {
      smallTreeMaps.pop();
    }

    if (regularTreeMaps.length === 0 || !vizDimension.width) {
      return (
        <TableRow>
          <TableCell colSpan="100%" className={classes.cell}>
            <Typography variant="h4" component="div" color="primary" align="center">
              {intl.formatMessage({ id: 'common.oilandgas.placeholder' })}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    // size of the rendering area
    const canvasWidth = vizDimension.width * 0.75;

    // sum up the total width among the treemaps
    const totalWidth = regularTreeMaps.reduce((acc, val) => acc + (val.width || 0), 0);

    // if the biggest treemap exceed the max size, then calculate a ratio for shrinking them down
    const maxPercentage = Math.max(0, ...regularTreeMaps.map(t => t.width)) / totalWidth;
    const ratio = (maxPercentage * canvasWidth) / MAX_SIZE / Math.sqrt(biggestRatio || 1);

    // prepare a method for calculate the screen sizes (in pixels) based on the canvas width
    const getSize = width => ((width / totalWidth) * canvasWidth) / (ratio > 1 ? ratio : 1);

    // calculate the vertical offset of the grouped tiles
    const groupOffset = `translateY(calc(-${compare ? `100% ${isTopChart ? '- 45' : '+ 224'}` : '84'}px))`;

    return (
      <TableRow>
        {regularTreeMaps.map(source => source && ({
          name: source.name,
          node: createTreeMap(source, isTopChart, getSize(source.width || 0)),
        })).map(tree => (tree ? (
          <TableCell
            key={`treemap-${tree.name}`}
            className={classes.cell}
            style={{ verticalAlign: isTopChart ? 'bottom' : 'top' }}
          >
            <Grid container direction="column" wrap="nowrap">
              {!isTopChart && <Grid item className={classes.tick} />}
              <Grid item>{tree.node}</Grid>
              {(compare && isTopChart) && <Grid item className={classes.tick} />}
            </Grid>
          </TableCell>
        ) : <TableCell key={`treemap-${tree.name}`} />))}

        {smallTreeMaps.length > 0 && (
          <TableCell
            className={classes.cell}
            style={{ width: 120 }}
          >
            <Grid
              container
              spacing={1}
              className={classes.group}
              style={{ transform: groupOffset }}
            >
              <Grid item xs={12}>
                <Typography variant="overline" align='center'>{intl.formatMessage({ id: 'common.oilandgas.groupLabel' })}</Typography>
              </Grid>
              {smallTreeMaps.map(source => ({
                name: source.name,
                node: createTreeMap(source, isTopChart, 40),
              })).map(tree => (
                <Grid item xs={12} sm={6} key={`grouped-treemap-${tree.name}`}>{tree.node}</Grid>
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
      <TableContainer className={classes.table}>
        <Table style={{ height: compare ? 710 : 270 }}>
          <TableBody>

            {currentTreeMapCollection}

            <TableRow key="yearSlider">
              <TableCell colSpan="100%" style={{ height: 51 }}>
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
  vizDimension: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
};

OilAndGas.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0, forecastStart: 0 },
  vizDimension: { height: 0, width: 0 },
};
export default OilAndGas;
