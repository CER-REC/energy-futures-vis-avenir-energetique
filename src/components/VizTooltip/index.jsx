import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Grid } from '@material-ui/core';
import { formatUnitAbbreviation } from '../../utilities/convertUnit';
import { UNIT_NAMES } from '../../constants';

const useStyles = makeStyles(theme => ({
  paper: { padding: theme.spacing(2) },
  content: { fontSize: 12 },
  color: {
    height: theme.spacing(2),
    width: theme.spacing(2),
    marginRight: theme.spacing(1.5),
  },
}));

const VizTooltip = ({ nodes, total, unit, year, paper, showTotal, showPercentage }) => {
  const classes = useStyles();

  const sum = total || (nodes || []).map(node => node.value).reduce((a, b) => a + b, 0);
  const content = (
    <Grid container direction="column" spacing={1} className={classes.content}>
      {year && <Grid item><strong>{year}:</strong></Grid>}
      {[
        ...(nodes || []),
        ...(showTotal && nodes && nodes.length > 1 ? [{ name: 'TOTAL', value: sum }] : []),
      ].filter(node => Math.abs(node.value) > Number.EPSILON).map((node) => {
        const showUnit = node.value === sum || !showPercentage;
        const num = formatUnitAbbreviation(node.value, showUnit && UNIT_NAMES[unit]);
        const suffix = showUnit ? '' : `(${((node.value / sum) * 100).toFixed(1)}%)`;
        return (
          <Grid item key={`viz-legend-item-${node.name}-${node.value}`}>
            <Grid container alignItems="center" wrap="nowrap">
              <div className={classes.color} style={{ backgroundColor: node.color || 'white' }} />
              <span><strong>{node.translation || node.name}:</strong>&nbsp;{`${num} ${suffix}`}</span>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );

  return paper ? <Paper className={classes.paper}>{content}</Paper> : content;
};

VizTooltip.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    translation: PropTypes.string,
    value: PropTypes.number,
    color: PropTypes.string,
  })).isRequired,
  total: PropTypes.number,
  unit: PropTypes.string.isRequired,
  year: PropTypes.number,
  paper: PropTypes.bool,
  showTotal: PropTypes.bool,
  showPercentage: PropTypes.bool,
};

VizTooltip.defaultProps = {
  total: 0,
  year: undefined,
  paper: false,
  showTotal: true, // determine whether or not the total value is displayed
  showPercentage: true, // determine whether or not percentages are displayed
};

export default VizTooltip;
