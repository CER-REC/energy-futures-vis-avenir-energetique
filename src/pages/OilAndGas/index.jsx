import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  // yearBox: {
  //   '& > div': {
  //     height: 26,
  //     width: 26,
  //   },
  //   '& + * h4': { fontWeight: 700 },
  // },
  cell: {
    minWidth: 0,
    padding: theme.spacing(1),
  },
  treeMapRectangle: {
    margin: 'auto',
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

  // Record the width of the entire viz DOM
  const [canvasWidth, setCanvasWidth] = useState(0);

  // Use the reference of the table DOM for determine whether the cells are ready to be rendered
  const refTable = React.createRef();

  // Memorized the current viz DOM width once the table reference exists
  useEffect(() => refTable?.current && setCanvasWidth(document.getElementById('viz').clientWidth * 0.6), [refTable]);

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
    };
  }, []);

  /**
   * Generate the treemap component based on the source values, size and location (top or bottom).
   */
  const createTreeMap = useCallback((source, isTopChart, size) => (
    <>
      <Typography align='center' varient="body2" style={{ bottom: 0, fontWeight: 700, fontSize: 12 }}>
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
    classes.treeMapRectangle, config.view, config.mainSelection,
    tooltip, compare, getColor, getTooltip, intl,
  ]);

  if (!data || Number.isNaN(data[currentYear][0].total)) {
    return null;
  }

  // Sorted datasets
  const {
    currentYearData,
    compareYearData,
  } = sortDataSets(data[currentYear], data[compareYear]);

  const treeMapCollection = (treeData, isTopChart) => {
    if (!canvasWidth) {
      return [];
    }

    const totalGrandTotal = treeData.reduce((acc, val) => acc + val.total, 0);
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

    if (regularTreeMaps.length === 0 || !canvasWidth) {
      return null;
    }

    const totalWidth = regularTreeMaps.reduce((acc, val) => acc + (val.width || 0), 0);

    return (
      <TableRow>
        {regularTreeMaps.map(source => source && ({
          name: source.name,
          node: createTreeMap(source, isTopChart, ((source.width || 0) / totalWidth) * canvasWidth),
        })).map(tree => (tree ? (
          <TableCell
            key={`treemap-${tree.name}`}
            className={classes.cell}
            style={{ verticalAlign: isTopChart ? 'bottom' : 'top' }}
          >
            <Grid container direction="column" wrap="nowrap" spacing={1}>
              {!isTopChart && <Grid item className={classes.tick} />}
              <Grid item>{tree.node}</Grid>
              {(compare && isTopChart) && <Grid item className={classes.tick} />}
            </Grid>
          </TableCell>
        ) : <TableCell key={`treemap-${tree.name}`} />))}

        {smallTreeMaps.length > 0 && (
          <TableCell
            className={classes.cell}
            style={{ width: 100, verticalAlign: isTopChart ? 'bottom' : 'top' }}
          >
            <Grid container spacing={1} className={classes.group}>
              <Grid item xs={12}>
                <Typography variant="overline" align='center'>Values less than 1%</Typography>
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
      <TableContainer style={{ marginTop: compare ? 120 : 40, overflow: 'hidden' }}>
        <Table ref={refTable}>
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
  year: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
};

OilAndGas.defaultProps = {
  data: undefined,
  year: { min: 0, max: 0 },
};
export default OilAndGas;
