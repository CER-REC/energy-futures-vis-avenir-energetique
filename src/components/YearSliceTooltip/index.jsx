import React from 'react';
import { makeStyles, Table } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import NodeSection from './NodeSection';

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: 'white',
    padding: theme.spacing(1),
    ...theme.overrides.MuiTooltip.tooltip,
  },
}));

const YearSliceTooltip = ({ sections, year, isSliceTooltip = false }) => {
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

YearSliceTooltip.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
      mask: PropTypes.string,
    })).isRequired,
    unit: PropTypes.string.isRequired,
    totalLabel: PropTypes.string,
    isPrice: PropTypes.bool,
    hasPercentage: PropTypes.bool,
  })).isRequired,
  year: PropTypes.string,
  isSliceTooltip: PropTypes.bool,
};

YearSliceTooltip.defaultProps = {
  year: undefined,
  isSliceTooltip: false,
};

export default YearSliceTooltip;

