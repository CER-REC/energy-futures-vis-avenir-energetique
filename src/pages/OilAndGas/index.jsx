import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Grid, Typography, Button } from '@material-ui/core';
import { ResponsiveTreeMap } from '@nivo/treemap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import YearSlider from '../../components/YearSlider';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';

const OilAndGas = ({ data, year }) => {
  const { config } = useConfig();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [compareYear, setCompareYear] = useState(currentYear);

  const { regions: { colors: regionColors } } = useAPI();

  // Compare button toggle
  const [compare, setCompare] = useState(false);

  // Sorted datasets. Can be improved
  const currentYearData = data[currentYear].length > 1 ? data[currentYear]
    .sort((a, b) => b.total - a.total) : data[currentYear];

  const compareYearData = data[compareYear].length > 1 ? data[compareYear]
    .sort((a, b) => b.total - a.total) : data[compareYear];

  const biggestTreeMap = currentYearData[0].total > compareYearData[0].total
    ? currentYearData[0]
    : compareYearData[0];

  if (!data) {
    return null;
  }

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
    C_5: 'green',
  };

  // bySource needs to be a bit bigger, because some sources are very small.
  const sizeMultiplier = () => {
    let multiplier = 1;
    if (config.mainSelection === 'oilProduction') {
      multiplier = 0.1;
    }
    return multiplier;
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
            height: source.total * sizeMultiplier(),
            width: source.total * sizeMultiplier(),
          }}
        >

          <Typography style={{ marginLeft: 10, bottom: 0 }}>
            {`${source.name}: ${percentage}%`}
          </Typography>

          <ResponsiveTreeMap
            root={source}
            identity="name"
            value="value"
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            label={d => d.name}
            labelSkipSize={12}
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

  const createData = (id = '', col1 = '', col2 = '', col3 = '', col4 = '', col5 = '') => ({ id, col1, col2, col3, col4, col5 });

  const rows = [
    createData('row1', '', '', '', '', compare
      ? (
        <>
          <Typography variant='h3'>{currentYear}</Typography>
          <Typography variant='h3'>{compareYear}</Typography>
        </>
      )
      : <Typography variant='h3'>{currentYear}</Typography>),
    createData('row3', '', '', '', '',
      <Button
        onClick={() => setCompare(!compare)}
        variant="outlined"
        style={{ marginTop: '10px' }}
      >
        <Typography
          variant='body1'
        >{compare ? "Don't Compare" : 'compare'}
        </Typography>
      </Button>),
    createData('row4', ...treeMapCollection(currentYearData)),
    ...(compare ? [createData('row5', ...treeMapCollection(compareYearData))] : []),
  ];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row" style={{ borderBottom: '0' }}>
                {row.col1}
              </TableCell>
              <TableCell align="right" style={{ borderBottom: '0' }}>{row.col2}</TableCell>
              <TableCell align="right" style={{ borderBottom: '0' }}>{row.col3}</TableCell>
              <TableCell align="right" style={{ borderBottom: '0' }}>{row.col4}</TableCell>
              <TableCell align="right" style={{ borderBottom: '0' }}>{row.col5}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    // <Grid container style={{ height: '100%' }}>

  //   <Grid style={{ marginLeft: '80%', align: 'right' }}>
  //     <Typography variant='h3'>{currentYear}</Typography>
  //     {compare
  //     && <Typography variant='h3'>{compareYear}</Typography>}
  //     <Button
  //       onClick={() => setCompare(!compare)}
  //       variant="outlined"
  //       style={{ marginTop: '10px' }}
  //     >
  //       <Typography
  //         variant='body1'
  //       >{compare ? "Don't Compare" : 'compare'}
  //       </Typography>
  //     </Button>
  //   </Grid>

  //   <Grid container spacing={8} wrap="nowrap">
  //     {treeMapCollection(currentYearData)}
  //   </Grid>

  //   {compare && (
  //   <Grid container spacing={8} wrap="nowrap">
  //     {treeMapCollection(compareYearData)}
  //   </Grid>
  //   )}

  //   <Grid container wrap="nowrap" style={{ marginTop: 15 }}>
  //     <YearSlider
  //       year={compare ? { curr: currentYear, compare: compareYear } : currentYear}
  //       onYearChange={(value) => {
  //         if ((value.curr || value) !== currentYear) {
  //           setCurrentYear(value.curr || value);
  //         } if (compare && value.compare !== compareYear) {
  //           setCompareYear(value.compare);
  //         }
  //       }}
  //       min={year.min}
  //       max={year.max}
  //     />
  //   </Grid>

  // </Grid>
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
