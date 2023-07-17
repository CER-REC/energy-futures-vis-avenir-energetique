import PropTypes from 'prop-types';
import { makeStyles, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { formatValue } from '../../../utilities/convertUnit';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    '& > tr > td': { padding: theme.spacing(0.25, 0.75) },
  },
  contrast: {
    '& > tr:nth-child(even)': { backgroundColor: '#F5F2F2' },
  },
  total: {
    '& > td:not(override)': {
      backgroundColor: 'white',
      padding: theme.spacing(1, 0.75),
    },
  },
  header: {
    '& > tr > th': { padding: theme.spacing(1, 0.75, 0.25, 0.75) },
  },
  color: {
    height: theme.spacing(2),
    width: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
}));

const NodeSection = ({ section, year = null }) => {
  const classes = useStyles();
  const intl = useIntl();

  const sum = section.totalLabel
    ? section.nodes.reduce((a, b) => a + b.value, 0) : 0;

  return (
    <>
      <TableHead className={classes.header}>
        <TableRow>
          {
            year && (
              <TableCell style={{ fontSize: 16 }}>
                {year}
              </TableCell>
            )
          }
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingTop: year ? 0 : 10 }}>
            <Typography variant="h6" style={{ fontSize: year ? 18 : 16 }}>
              {section.title}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <strong>{section.unit}</strong>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody
        className={clsx(classes.gridContainer, { [classes.contrast]: section.nodes.length > 3 })}
      >
        {
          section.nodes.map(node => (
            <TableRow key={node.name}>
              <TableCell size="small" style={{ display: 'flex' }}>
                <div className={classes.color} style={{ backgroundColor: node.mask ? 'transparent' : node.color }}>
                  {node.mask && (
                    <svg height="100%" width="100%" viewBox="0 0 30 30">
                      <rect height="100%" width="100%" fill={node.color || '#FFF'} mask={node.mask} />
                    </svg>
                  )}
                </div>
                {node.name}
              </TableCell>
              <TableCell align="right">
                <strong>
                  {
                    section.isPrice && ('$')
                  }
                  {formatValue(node.value, intl)}
                  {
                    section.hasPercentage && (
                      ` (${formatValue(sum ? (node.value / sum) * 100 : 0, intl)}${intl.formatMessage({ id: 'common.char.percent' })})`
                    )
                  }
                </strong>
              </TableCell>
            </TableRow>
          ))
        }
        {
          section.totalLabel && (
            <TableRow className={classes.total}>
              <TableCell>
                {section.totalLabel}
              </TableCell>
              <TableCell align="right">
                <strong>
                  {formatValue(sum, intl)}
                </strong>
              </TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </>
  );
};

NodeSection.propTypes = {
  section: PropTypes.shape({
    title: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
      mask: PropTypes.string,
    })),
    unit: PropTypes.string.isRequired,
    totalLabel: PropTypes.string,
    isPrice: PropTypes.bool,
    hasPercentage: PropTypes.bool,
  }).isRequired,
  year: PropTypes.string,
};

NodeSection.defaultProps = {
  year: undefined,
};

export default NodeSection;
