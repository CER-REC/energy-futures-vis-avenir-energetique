import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  makeStyles, Grid, Typography, Button, Tooltip,
  TableContainer, Table, TableBody, TableRow, TableCell,
} from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import YearSlider from '../../components/YearSlider';
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
    right: theme.spacing(2.5),
    width: 88,
    border: `1px solid ${theme.palette.secondary.main}`,
    '& span': { lineHeight: 1.2 },
  },
  label: {
    fontWeight: 700,
    fontSize: 12,
    lineHeight: 1.25,
  },
  tick: {
    position: 'absolute',
    height: 40,
    width: 1,
    left: 'calc(50% - .5px)',
    backgroundImage: `linear-gradient(${theme.palette.secondary.light} 33%, transparent 0%)`,
    backgroundSize: '1px 8px',
    backgroundRepeat: 'repeat-y',
    '&:first-of-type': { top: -50 },
    '&:last-of-type': { bottom: -50 },
  },
  legend: {
    float: 'right',
    width: 'max-content',
    margin: theme.spacing(1.5),
    padding: theme.spacing(1),
    backgroundColor: '#F3EFEF',
    '& svg': { verticalAlign: 'middle' },
  },
}));

const MAX_SIZE = 250;

const OilAndGas = ({ data, year, vizDimension }) => {
  const classes = useStyles();
  const { config, configDispatch } = useConfig();
  const intl = useIntl();

  const iteration = useMemo(() => parseInt(config.yearId, 10), [config.yearId]);

  const legendTranslationPath = `common.oilandgas.legend.${config.mainSelection}.${config.view}`;

  const [currentYear, setCurrentYear] = useState(config.baseYear || iteration);
  const [compareYear, setCompareYear] = useState(config.compareYear || iteration);

  const {
    regions: { colors: regionColors },
    sources: { oil: { colors: oilColors }, gas: { colors: gasColors } },
  } = useAPI();

  // Compare button toggle
  const compare = useMemo(() => !config.noCompare, [config.noCompare]);

  // Determine which tooltip is currently open
  const [tooltip, setTooltip] = useState(undefined);

  // 'oil' or 'gas' which is used for generating translation text
  const type = useMemo(() => (config.mainSelection === 'oilProduction' ? 'oil' : 'gas'), [config.mainSelection]);

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
            ? `common.sources.${type}.${value.name}`
            : `common.regions.${value.name}`,
        }),
        value: value.value,
        color: getColor(value),
      }))}
      unit={config.unit}
    />
  ), [config.view, config.unit, intl, type, getColor]);

  /**
   * Determine the position of the tooltip based on the treemap size and the number of nodes.
   */
  const getTooltipPos = useCallback((length, size, isTopChart) => {
    if (length > 3 && size > 120) {
      return (compare && isTopChart) ? 'left' : 'right';
    }
    return (compare && isTopChart) ? 'top' : 'bottom';
  }, [compare]);

  /**
   * Capture hover event but don't send repeated records.
   */
  const prevEvent = useRef(null);
  const handleEventUpdate = useCallback((source) => {
    const event = `${source.name} - ${config.baseYear || year?.min}`;
    if (event !== prevEvent.current) {
      analytics.reportPoi(config.page, event);
      prevEvent.current = event;
    }
  }, [year, config.baseYear, config.page, prevEvent]);

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

  // FIXME: This is a temporary patch to remove percentages on single select.
  const showPercentages = useCallback(() => !(config.provinces.length === 1 && config.provinces[0] !== 'ALL'),
    [config.provinces]);

  /**
   * Generate the treemap component based on the source values, size and location (top or bottom).
   */
  const createTreeMap = useCallback((source, isTopChart, size) => (
    <>
      <Typography align='center' varient="body2" className={classes.label}>
        {config.view === 'source' ? intl.formatMessage({
          id: `common.oilandgas.displayName.${source.name}`,
          defaultMessage: intl.formatMessage({ id: `common.sources.${type}.${source.name}` }),
        }) : source.name}
        {(config.view === 'region' && source.percentage > 1 && showPercentages()) && `: ${source.percentage.toFixed(2)}%`}
      </Typography>
      <Tooltip
        open={source.name === tooltip}
        title={getTooltip(source)}
        placement={getTooltipPos(source.children.length, size, isTopChart)}
        onOpen={() => {
          setTooltip(source.name);
          handleEventUpdate(source);
        }}
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
            margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
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
    classes.label,
    classes.treeMapRectangle,
    config.view,
    intl,
    type,
    showPercentages,
    tooltip,
    getTooltip,
    getTooltipPos,
    getColor,
    handleEventUpdate,
  ]);

  /**
   * Update the state of the compare button and send the event to data analytics
   */
  const handleCompareUpdate = useCallback(() => {
    configDispatch({ type: 'noCompare/changed', payload: compare });
    analytics.reportMedia(config.page, compare ? 'don\'t compare' : 'compare');
  }, [configDispatch, compare, config.page]);

  // data not ready; render nothing
  if (!data || !data[currentYear] || !data[compareYear]) {
    return null;
  }

  // data content not valid; render nothing
  if (
    Number.isNaN(Number(data[currentYear][0].total))
    || Number.isNaN(Number(data[compareYear][0].total))
  ) {
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
    const biggestRatio = Math.max(0, ...treeData.map(source => source.total || 0)) / biggestValue;

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
        smallTreeMaps.push({ ...sortedSource, percentage, width: percentage ** 0.333 });
      }
      if (percentage > 1) {
        regularTreeMaps.push({ ...sortedSource, percentage, width: percentage ** 0.333 });
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
            <Typography variant="body1" component="div" color="secondary" align="center">
              {config.view === 'region' && config.provinces.length === 1 && `${config.provinces[0]}: 0%`}
              {config.view === 'source' && config.sources.length === 1 && `${intl.formatMessage({ id: `common.sources.${type}.${config.sources[0]}` })}: 0%`}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    // size of the rendering area
    const canvasWidth = vizDimension.width * 0.7;

    // sum up the total width among the treemaps
    const totalWidth = regularTreeMaps.reduce((acc, val) => acc + (val.width || 0), 0);

    // if the biggest treemap exceed the max size, then calculate a ratio for shrinking them down
    const maxPercentage = Math.max(0, ...regularTreeMaps.map(t => t.width || 0)) / totalWidth;
    const ratio = (maxPercentage * canvasWidth) / MAX_SIZE / Math.sqrt(biggestRatio || 1);

    // prepare a method for calculate the screen sizes (in pixels) based on the canvas width
    const getSize = width => ((width / totalWidth) * canvasWidth) / ((ratio || 1) > 1 ? ratio : 1);

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
            <Grid container direction="column" wrap="nowrap" style={{ position: 'relative' }}>
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
              style={isTopChart ? { bottom: compare ? 414 : 99 } : { top: 410 }}
            >
              <Grid item xs={12}>
                <Typography variant="overline" align="center" component="div" style={{ lineHeight: 1.25 }}>
                  {intl.formatMessage({ id: 'common.oilandgas.groupLabel' })}
                </Typography>
              </Grid>
              {smallTreeMaps.map(source => ({
                name: source.name,
                node: createTreeMap(source, isTopChart, 32),
              })).map(tree => (
                <Grid item xs={12} sm={smallTreeMaps.length > 1 ? 6 : 12} key={`grouped-treemap-${tree.name}`}>{tree.node}</Grid>
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
          <Button variant="outlined" color="primary" size="small" onClick={handleCompareUpdate}>
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
                    }
                    if (compare && value.compare !== compareYear) {
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
        <Typography variant="caption" align="center">
          <strong>
            {/* FIXME: this is a temporary fix to remove percentages from the legend */}
            {intl.formatMessage({ id: `${legendTranslationPath}.view` })}
            {(config.view === 'region' && showPercentages())
              && ` ${intl.formatMessage({ id: `${legendTranslationPath}.title` })}`}
          </strong>
        </Typography>

        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item><IconOilAndGasRectangle /></Grid>
          <Grid item>
            <Typography variant="caption">
              {intl.formatMessage({ id: `${legendTranslationPath}.single` })}
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          <Grid item><IconOilAndGasGroup /></Grid>
          <Grid item>
            <Typography variant="caption">
              {intl.formatMessage({ id: `${legendTranslationPath}.group` })}
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
