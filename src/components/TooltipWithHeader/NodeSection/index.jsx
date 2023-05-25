import PropTypes from "prop-types";
import {makeStyles, TableBody, TableCell, TableHead, TableRow, Typography} from "@material-ui/core";
import React from "react";
import clsx from "clsx";
import {useIntl} from "react-intl";
import {formatValue} from "../../../utilities/convertUnit";

const useStyles = makeStyles(theme => ({
  gridContainer: {
    '& > tr > td': { padding: theme.spacing(0.25, 0.75) },
  },
  contrast : {
    '& > tr:nth-child(even)': { backgroundColor: '#F5F2F2', }
  },
  total: {
    backgroundColor: 'white !important',
    '& > td:first-child': {
      padding: theme.spacing(1, 0.75),
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

const NodeSection = ({ section, year = null }) => {
  const classes = useStyles();
  const intl = useIntl();

  const sum = section.hasTotal
    ? section.nodes.map(node => node.value).reduce((a, b) => a + b, 0) : 0;

  return (
    <>
      <TableHead className={classes.header}>
        <TableRow>
          {
            year && (
              <TableCell>
                {year}
              </TableCell>
            )
          }
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingTop: 0 }}>
            <Typography variant="h6" style={{ fontSize: year ? 18 : 16 }}>
              {section.title}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <strong>{intl.formatMessage({ id: `common.units.${section.unit}` })}</strong>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody
        className={clsx({
          [classes.gridContainer] : true,
          [classes.contrast] : section.nodes.length > 3
        })}>
        {
          section.nodes.map((node) => (
            <TableRow key={node.name}>
              <TableCell size="small" style={{ display: 'flex' }}>
                <div className={classes.color}>
                  <svg height="100%" width="100%" viewBox="0 0 30 30">
                    <rect height="100%" width="100%" fill={node.color || '#FFF'} />
                  </svg>
                </div>
                <strong>{node.name}</strong>
              </TableCell>
              <TableCell align="right">
                {formatValue(node.value, intl)}
              </TableCell>
            </TableRow>
          ))
        }
        {
          section.hasTotal && (
            <TableRow className={classes.total}>
              <TableCell>
                <strong>
                  {intl.formatMessage({ id: 'common.netEmissions' })}
                </strong>
              </TableCell>
              <TableCell align="right">
                {formatValue(sum, intl)};
              </TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </>
  )
}

NodeSection.propTypes = {
  section: PropTypes.shape({
    title: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
    })),
    unit: PropTypes.string.isRequired,
    hasTotal: PropTypes.bool
  }).isRequired,
  year: PropTypes.string
};

NodeSection.defaultProps = {
  year: undefined
}

export default NodeSection;
