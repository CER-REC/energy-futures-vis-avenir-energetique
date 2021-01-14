import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { formatUnitAbbreviation } from '../../utilities/convertUnit';

const useStyles = makeStyles(theme => ({
  paper: { padding: theme.spacing(2) },
  row: {
    '& > td': { padding: theme.spacing(0.25, 0.75) },
  },
  color: {
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
}));

const VizTooltip = ({ nodes, total, unit, year, paper, showTotal, showPercentage }) => {
  const classes = useStyles();
  const intl = useIntl();

  const sum = total || (nodes || []).map(node => node.value).reduce((a, b) => a + b, 0);
  const content = (
    <Table>
      <TableBody>
        {year && (
          <TableRow>
            <TableCell colSpan={2} size="small">
              <strong>{year}{intl.formatMessage({ id: 'common.char.colon' })}</strong>
            </TableCell>
          </TableRow>
        )}
        {[
          ...(nodes || []),
          ...(showTotal && nodes && nodes.length > 1
            ? [{ name: intl.formatMessage({ id: 'components.draggableVerticalList.all' }), value: sum }]
            : []),
        ].filter(node => Math.abs(node.value) > Number.EPSILON).map((node) => {
          const showUnit = node.value === sum || !showPercentage;
          const num = formatUnitAbbreviation(node.value, showUnit && intl.formatMessage({ id: `common.units.${unit}` }), intl);
          const suffix = showUnit
            ? ''
            : `(${((node.value / sum) * 100).toLocaleString(intl.locale, { maximumFractionDigits: 2 })}${intl.formatMessage({ id: 'common.char.percent' })})`;
          return (
            <TableRow key={`viz-legend-item-${node.name}-${node.value}`} className={classes.row}>
              <TableCell size="small">
                <div className={classes.color} style={{ backgroundColor: node.mask ? 'transparent' : node.color }}>
                  {node.mask && (
                    <svg x="0" y="0" height="100%" width="100%" viewBox="0 0 30 30">
                      <rect x="0" y="0" height="100%" width="100%" fill={node.color || '#FFF'} mask={node.mask} />
                    </svg>
                  )}
                </div>
              </TableCell>
              <TableCell size="small">
                <strong>{node.translation || node.name}{intl.formatMessage({ id: 'common.char.colon' })}</strong>
                &nbsp;{`${num} ${suffix}`}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return paper ? <Paper className={classes.paper}>{content}</Paper> : content;
};

VizTooltip.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    translation: PropTypes.string,
    value: PropTypes.number,
    // tooltip nodes take in either solid colors or existing pattern masking
    color: PropTypes.string,
    mask: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  })),
  total: PropTypes.number,
  unit: PropTypes.string.isRequired,
  year: PropTypes.number,
  paper: PropTypes.bool,
  showTotal: PropTypes.bool,
  showPercentage: PropTypes.bool,
};

VizTooltip.defaultProps = {
  nodes: [],
  total: 0,
  year: undefined,
  paper: false,
  showTotal: true, // determine whether or not the total value is displayed
  showPercentage: true, // determine whether or not percentages are displayed
};

export default VizTooltip;
