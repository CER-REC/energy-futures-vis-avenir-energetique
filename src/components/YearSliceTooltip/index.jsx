import React from 'react';
import { makeStyles, Table } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import NodeSection from './NodeSection';

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: 'white',
    padding: theme.spacing(1),
  },
}));

const Tooltip = ({ sections, year, isSliceTooltip = false }) => {
  const classes = useStyles();

  return (
    <div className={clsx({ [classes.wrapper]: isSliceTooltip })}>
      <Table>
        {
          sections.map((section, i) => (
            <NodeSection
              key={section.title}
              year={i === 0 ? year : null}
              section={section}
            />
          ))
        }
      </Table>
    </div>
  );
};

Tooltip.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
      mask: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    })).isRequired,
    unit: PropTypes.string.isRequired,
    totalLabel: PropTypes.string,
    isPrice: PropTypes.bool,
    hasPercentage: PropTypes.bool,
  })).isRequired,
  year: PropTypes.string,
  isSliceTooltip: PropTypes.bool,
};

Tooltip.defaultProps = {
  year: undefined,
  isSliceTooltip: false,
};

export default Tooltip;

