import React from 'react';
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: 'white',
    padding: theme.spacing(1),
  },
  gridContainer: {
    '& > tr > td': { padding: theme.spacing(0.25, 0.75) },
  },
  total: {
    backgroundColor: 'white',
    '& > td:nth-last-child(2)': {
      padding: theme.spacing(1, 0.75, 1, 0.75),
    },
  },
  highlightedRow: {
    '& > td': {
      backgroundColor: '#F5F2F2',
    },
  },
  header: {
    '& > tr > th': { padding: theme.spacing(1, 0.75, 0.25, 0.75) },
  },
  color: {
    height: theme.spacing(2),
    width: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

const TooltipWithHeader = ({
  title,
  nodes,
  year,
  unit,
  showTotal,
  isSliceTooltip = false,
  title2 = null,
  nodes2 = null,
  unit2 = null,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const sum = nodes.map(node => node.value).reduce((a, b) => a + b, 0);

  const createRow = (node, highlight = false) => (
    <TableRow key={node.name} className={clsx({ [classes.highlightedRow]: highlight })}>
      <TableCell size="small" style={{ display: 'flex' }}>
        <div className={classes.color}>
          <svg height="100%" width="100%" viewBox="0 0 30 30">
            <rect height="100%" width="100%" fill={node.color || '#FFF'} />
          </svg>
        </div>
        <strong>{node.translation}</strong>
      </TableCell>
      <TableCell align="right">
        {node.value.toFixed(3)}
      </TableCell>
    </TableRow>
  );

  return (
    <div className={clsx({ [classes.wrapper]: isSliceTooltip })}>
      <Table>
        <TableHead className={classes.header}>
          <TableRow>
            <TableCell>
              {year}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingTop: 0 }}>
              <Typography variant="h6" style={{ fontSize: 18 }}>
                {title}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <strong>{intl.formatMessage({ id: `common.units.${unit}` })}</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.gridContainer}>
          {
            nodes.map((node, i) => (
              nodes.length >= 3 && i % 2 ? createRow(node, true) : createRow(node)))
          }
          {
            showTotal && (
              <TableRow className={classes.total}>
                <TableCell>
                  <strong>
                    {intl.formatMessage({ id: 'common.netEmissions' })}
                  </strong>
                </TableCell>
                <TableCell align="right">
                  {sum.toFixed(3)}
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
        {
          title2 !== null && nodes2 !== null && unit2 !== null && (
            <>
              <TableHead className={classes.header}>
                <TableRow />
                <TableRow>
                  <TableCell>
                    <Typography>
                      <strong>{title2}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{intl.formatMessage({ id: `common.units.${unit2}` })}</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.gridContainer}>
                {
                  nodes2.map((node, i) => (
                    nodes2.length >= 3 && i % 2 ? createRow(node, true) : createRow(node)))
                }
              </TableBody>
            </>
          )
        }
      </Table>
    </div>
  );
};

TooltipWithHeader.propTypes = {
  title: PropTypes.string.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
    color: PropTypes.string,
    translation: PropTypes.string,
  })).isRequired,
  year: PropTypes.string,
  unit: PropTypes.string.isRequired,
  showTotal: PropTypes.bool,
  isSliceTooltip: PropTypes.bool,
  title2: PropTypes.string,
  nodes2: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
    color: PropTypes.string,
    translation: PropTypes.string,
  })),
  unit2: PropTypes.string,
};

TooltipWithHeader.defaultProps = {
  year: undefined,
  showTotal: false,
  isSliceTooltip: false,
  title2: null,
  nodes2: null,
  unit2: null,
};

export default TooltipWithHeader;

