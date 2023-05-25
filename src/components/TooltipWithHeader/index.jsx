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

const TooltipWithHeader = ({ sections, year, isSliceTooltip = false }) => {
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

TooltipWithHeader.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
    })).isRequired,
    unit: PropTypes.string.isRequired,
    hasTotal: PropTypes.bool,
  })).isRequired,
  year: PropTypes.string,
  isSliceTooltip: PropTypes.bool,
};

TooltipWithHeader.defaultProps = {
  year: undefined,
  isSliceTooltip: false,
};

export default TooltipWithHeader;

