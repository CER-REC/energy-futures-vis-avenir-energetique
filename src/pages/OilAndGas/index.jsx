import React, { useState, useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import {
  makeStyles, Grid, Typography, Button, Tooltip,
  TableContainer, Table, TableBody, TableRow, TableCell,
} from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import YearSlider from '../../components/YearSlider';
import { IconOilAndGasGroup, IconOilAndGasRectangle } from '../../icons';
import YearSliceTooltip from '../../components/YearSliceTooltip';
import UnavailableDataMessage from '../../components/UnavailableDataMessage';
import useEnergyFutureData from '../../hooks/useEnergyFutureData';
import { formatValue } from '../../utilities/convertUnit';

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
  table: {
    marginTop: theme.spacing(8),
    '& > table': { position: 'relative' },
    '& tr:first-child td': { verticalAlign: 'bottom' },
    '& tr:nth-child(3) td': { verticalAlign: 'top' },
  },
  cell: {
    height: 300,
    minWidth: 0,
    padding: theme.spacing(1),
  },
  treeMapRectangle: {
    border: '2px solid transparent',
    margin: 'auto',
    '& svg': { transform: 'rotate(270deg) scaleX(-1)' },
    '& > div > div > div:last-of-type': { display: 'none' }, // hide the default Nivo tooltip
  },
  group: {
    margin: 'auto',
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
    backgroundColor: theme.palette.background.light,
    '& svg': { verticalAlign: 'middle' },
  },
  compareBtn: {
    textTransform: 'uppercase',
    padding: '0px 2px',
  },
}));

const MAX_SIZE = 250;

const processData = (data, view, unitConversion) => {
  const outer = view === 'source' ? 'source' : 'province';
  const inner = view === 'source' ? 'province' : 'source';

  let baseStructure = data?.reduce((acc, val) => {
    if (!acc[val.year]) {
      acc[val.year] = [];
    }
    if (!acc[val.year].find(element => element.name === val[outer])) {
      acc[val.year].push({ name: val[outer], total: 0, children: [] });
    }
    return acc;
  }, {});

  // I am not super happy with the way this logic mutates the baseStructure
  baseStructure = data?.reduce((acc, val) => {
    if (val.source !== 'ALL' && val.value > 0) {
      const entry = acc[val.year].find(e => e.name === val[outer]);
      entry.children.push({
        name: val[inner],
        value: val.value * unitConversion,
      });
      entry.total += (val.value * unitConversion);
    }
    return acc;
  }, baseStructure);
  return baseStructure;
};

const OilAndGas = () => {
  const classes = useStyles();
  const { config, configDispatch } = useConfig();
  const { data, year, unitConversion } = useEnergyFutureData();
  const intl = useIntl();

  const [vizDimension, setVizDimension] = useState({ height: 0, width: 0 });

  const iteration = useMemo(() => parseInt(config.yearId, 10), [config.yearId]);

  const legendTranslationPath = `common.oilandgas.legend.${config.mainSelection}.${config.view}`;

  const currentYear = config.baseYear || iteration;
  const compareYear = config.compareYear || year.max;

  const {
    regions: { colors: regionColors },
    sources: { oil: { colors: oilColors }, gas: { colors: gasColors } },
  } = useAPI();

  const formatPercentage = useCallback(
    percentage => `${intl.formatMessage({ id: 'common.char.colon' })} ${formatValue(percentage, intl)}${intl.formatMessage({ id: 'common.char.percent' })}`,
    [intl],
  );
  const compare = useMemo(() => !config.noCompare, [config.noCompare]);

  const [tooltip, setTooltip] = useState();

  const type = useMemo(() => (config.mainSelection === 'oilProduction' ? 'oil' : 'gas'), [config.mainSelection]);

  const getColor = useCallback((d) => {
    let color;
    if (config.view === 'source') {
      color = regionColors[d.name];
    } else {
      color = config.mainSelection === 'oilProduction' ? oilColors[d.name] : gasColors[d.name];
    }
    return color;
  }, [config.mainSelection, config.view, gasColors, oilColors, regionColors]);

  const getTooltip = useCallback((entry) => {
    const section = {
      title: intl.formatMessage({ id: `common.scenarios.${config.scenarios[0]}` }),
      nodes: (entry.children || []).map(value => ({
        name: intl.formatMessage({
          id: config.view === 'region'
            ? `common.sources.${type}.${value.name}`
            : `common.regions.${value.name}`,
        }),
        value: value.value,
        color: getColor(value),
      })),
      unit: intl.formatMessage({ id: `common.units.${config.unit}` }),
      totalLabel: intl.formatMessage({ id: 'common.total' }),
      hasPercentage: true,
    };

    return (
      <YearSliceTooltip
        sections={[section]}
        year={entry.year.toString()}
      />
    );
  }, [intl, config.scenarios, config.unit, config.view, type, getColor]);

  const sortDataSets = useCallback((curr, comp) => {
    const currentYearData = (curr || []).sort((a, b) => b.total - a.total);
    const sortOrder = currentYearData.map(item => item.name);
    const compareYearData = (sortOrder || []).map(item => comp.find(x => x.name === item));

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

  const createTreeMap = useCallback((source, isTopChart, size, isSmall) => (
    <>
      <Typography align='center' varient="body2" className={classes.label}>
        {config.view === 'source' ? intl.formatMessage({
          id: `common.oilandgas.displayName.${source.name}`,
          defaultMessage: intl.formatMessage({ id: `common.sources.${type}.${source.name}` }),
        }) : source.name}
        {(config.view === 'region' && showPercentages()) && formatPercentage(source.percentage)}
      </Typography>
      { !isSmall && source.percentage > 0 && source.percentage < 1 && (
        <Typography variant="overline" align="center" component="div" style={{ lineHeight: 1.25 }}>
          {intl.formatMessage({ id: 'common.oilandgas.groupLabelSingular' })}
        </Typography>
      )}
      { (isSmall || source.percentage >= 1) && (
        <Tooltip
          open={source.name === tooltip}
          title={getTooltip(source)}
          placement={isTopChart ? 'right-end' : 'right-start'}
          onOpen={() => setTooltip(source.name)}
          onClose={() => setTooltip()}
        >
          <div
            className={classes.treeMapRectangle}
            style={{
              borderColor: (source.name === tooltip) && 'black',
              height: size,
              width: size,
            }}
          >
            <ResponsiveTreeMap
              root={source}
              tile="binary"
              identity="name"
              value="value"
              enableLabel={false}
              colors={getColor}
              animate
              motionStiffness={90}
              motionDamping={11}
              leavesOnly
            />
          </div>
        </Tooltip>
      )}
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
    getColor,
    formatPercentage,
  ]);

  const handleCompareUpdate = useCallback(() => {
    configDispatch({ type: 'noCompare/changed', payload: compare });
    analytics.reportMedia(config.page, compare ? 'don\'t compare' : 'compare');
  }, [configDispatch, compare, config.page]);

  const processedData = processData(data, config.view, unitConversion);

  const vizRef = useCallback((node) => {
    if (node) setVizDimension(node.getBoundingClientRect());
  }, []);

  if (config.view === 'region' && config.sources.length === 0) return <UnavailableDataMessage message={intl.formatMessage({ id: 'common.unavailableData.noSourceSelected' })} />;
  if (config.view === 'source' && config.provinces.length === 0) return <UnavailableDataMessage message={intl.formatMessage({ id: 'common.unavailableData.noRegionSelected' })} />;

  if (!processedData || !processedData[currentYear] || !processedData[compareYear]) {
    return (<UnavailableDataMessage message={intl.formatMessage({ id: 'common.unavailableData.default' })} />);
  }

  if (
    Number.isNaN(Number(processedData[currentYear][0].total))
    || Number.isNaN(Number(processedData[compareYear][0].total))
  ) {
    return null;
  }

  const {
    currentYearData,
    compareYearData,
    biggestValue,
  } = sortDataSets(processedData[currentYear], processedData[compareYear]);

  const treeMapCollection = (treeData, treeDataCompanion = [], treeYear, isTopChart) => {
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
        year: treeYear,
        total: source.total,
        children: source.children.sort((a, b) => b.value - a.value),
      };

      const percentage = (sortedSource.total / totalGrandTotal) * 100;
      const sourceCompanion = treeDataCompanion.find(s => s.name === source.name);
      const percentageCompanion = sourceCompanion
        && (sourceCompanion.total / totalGrandTotal) * 100;

      if (percentage > 0 && percentage <= 1) {
        smallTreeMaps.push({ ...sortedSource, percentage, width: percentage ** 0.333 });
      }
      if (
        (config.noCompare && percentage > 1)
        || (!config.noCompare && (percentage > 0 || (percentageCompanion > 0)))
      ) {
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
        {regularTreeMaps.map(source => ({
          name: source.name,
          node: createTreeMap(source, isTopChart, getSize(source.width || 0)),
        })).map(tree => ((
          <TableCell
            key={`treemap-${tree.name}`}
            className={classes.cell}
          >
            <Grid container direction="column" wrap="nowrap" style={{ position: 'relative' }}>
              {!isTopChart && <Grid item className={classes.tick} />}
              <Grid item>{tree.node}</Grid>
              {(compare && isTopChart) && <Grid item className={classes.tick} />}
            </Grid>
          </TableCell>
        )))}

        {smallTreeMaps.length > 0 && (
          <TableCell
            className={classes.cell}
            style={{ width: 120 }}
          >
            <Grid
              container
              spacing={1}
              className={classes.group}
            >
              <Grid item xs={12}>
                <Typography variant="overline" align="center" component="div" style={{ lineHeight: 1.25, textTransform: 'uppercase' }}>
                  {intl.formatMessage({ id: 'common.oilandgas.groupLabel' })}
                </Typography>
              </Grid>
              {smallTreeMaps.map(source => ({
                name: source.name,
                node: createTreeMap(source, isTopChart, 32, true),
              })).map(tree => (
                <Grid item xs={12} sm={smallTreeMaps.length > 1 ? 6 : 12} key={`grouped-treemap-${tree.name}`}>{tree.node}</Grid>
              ))}
            </Grid>
          </TableCell>
        )}
      </TableRow>
    );
  };

  const currentTreeMapCollection = treeMapCollection(
    currentYearData || [],
    (!config.noCompare && compareYearData) || [],
    currentYear,
    true,
  );
  const compareTreeMapCollection = treeMapCollection(
    compareYearData || [],
    (!config.noCompare && currentYearData) || [],
    compareYear,
    false,
  );

  if (!currentTreeMapCollection && !compareTreeMapCollection) {
    return null;
  }

  return (
    <div ref={vizRef}>
      {/* year numbers and the compare button (top-right) */}
      <Grid container direction="column" className={classes.year}>
        <Grid item>
          <Grid container alignItems="center" wrap="nowrap" spacing={1}>
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
              <Grid item>
                <Typography color='secondary' variant='h4' style={{ padding: '0px 20px' }}>
                  {compareYear}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleCompareUpdate}
            className={classes.compareBtn}
          >
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
    </div>
  );
};

export default OilAndGas;
