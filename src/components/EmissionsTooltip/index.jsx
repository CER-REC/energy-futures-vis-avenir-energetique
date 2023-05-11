import React from 'react';
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import useConfig from '../../hooks/useConfig';
import { formatUnitAbbreviation } from '../../utilities/convertUnit';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    '& > tr > td': { padding: theme.spacing(0.25, 0.75) },
    '& > tr:nth-child(even)': {
      backgroundColor: '#F5F2F2',
    },
    '& > tr:last-child': {
      backgroundColor: 'white',
      '& > td': {
        padding: theme.spacing(1, 0.75, 1, 0.75),
      },
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

const EmissionsTooltip = ({ nodes, year, unit }) => {
  const classes = useStyles();
  const { config } = useConfig();
  const intl = useIntl();

  const sum = nodes.map(node => node.value).reduce((a, b) => a + b, 0);

  return (
    <Table>
      <TableHead className={classes.header}>
        <TableRow>
          <TableCell>
            {year}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingTop: 0 }}>
            <Typography variant="h6" style={{ fontSize: 16 }}>
              {config.scenarios[0]}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody className={classes.gridContainer}>
        {nodes.map(node => (
          <TableRow key={node.name}>
            <TableCell size="small" style={{ display: 'flex' }}>
              <div className={classes.color}>
                <svg height="100%" width="100%" viewBox="0 0 30 30">
                  <rect height="100%" width="100%" fill={node.color || '#FFF'} />
                </svg>
              </div>
              <strong>{intl.formatMessage({ id: `common.sources.greenhouseGas.${node.name}` })}</strong>
            </TableCell>
            <TableCell align="right">
              {formatUnitAbbreviation(node.value, intl.formatMessage({ id: `common.units.${unit}` }), intl)}
            </TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell>
            <strong>{intl.formatMessage({ id: 'common.netEmissions' })}
            </strong>
          </TableCell>
          <TableCell align="right">
            {formatUnitAbbreviation(sum, intl.formatMessage({ id: `common.units.${unit}` }), intl)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

EmissionsTooltip.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
    color: PropTypes.string,
  })).isRequired,
  year: PropTypes.string,
  unit: PropTypes.string.isRequired,
};

EmissionsTooltip.defaultProps = {
  year: undefined,
};

export default EmissionsTooltip;

