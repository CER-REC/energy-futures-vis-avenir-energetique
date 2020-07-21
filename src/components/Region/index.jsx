import React, { useContext, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  makeStyles, Grid, Typography,
} from '@material-ui/core';
import DragIcon from '@material-ui/icons/DragIndicator';

import { ConfigContext } from '../../containers/App/lazy';
import { PROVINCES, REGION_COLOR, REGION_LABEL } from '../../types';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ColoredProvinceBox = ({ province, color, selected, ...props }) => {
  const classes = makeStyles(theme => ({
    root: {
      position: 'absolute',
      height: 36,
      width: 36,
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${color[600]}`,
      transition: 'box-shadow .25s ease-in-out',
      '& > p': {
        margin: 'auto',
        color: color[800],
      },
      '&.selected': { backgroundColor: color[600] },
      '&.selected > p': { color: theme.palette.common.white },
      '&:hover': { boxShadow: theme.shadows[6] },

      '& > div': {
        position: 'absolute',
        left: 40,
        top: '50%',
        color: '#666',
        opacity: 0,
        transition: 'opacity .25s ease-in-out',
        transform: 'translateY(-50%)',
      },
      '&:hover > div': { opacity: 1 },

      '& > div > svg': { marginRight: 4 },
      '& > div > span': {
        lineHeight: 1,
        backgroundColor: 'rgba(255, 255, 255, .75)',
      },
    },
  }))();
  return (
    <Grid container {...props} className={`${classes.root} ${selected && 'selected'}`}>
      <Typography variant="body2">{province}</Typography>
      <Grid container alignItems="center" wrap="nowrap">
        <DragIcon fontSize="small" />
        <Typography variant="overline">{REGION_LABEL[province]}</Typography>
      </Grid>
    </Grid>
  );
};

const Region = ({ width }) => {
  const classes = useStyles({ width });

  const { config, setConfig } = useContext(ConfigContext);

  const [provinces, setProvinces] = useState(config.provinces || PROVINCES);
  const [provinceOrder, setProvinceOrder] = useState(config.provinceOrder || PROVINCES);

  /**
   * Update the global store if the local copy modified.
   */
  useEffect(() => { setConfig({ ...config, provinces }) }, [provinces]);
  useEffect(() => { setConfig({ ...config, provinceOrder }) }, [provinceOrder]);

  /**
   * The global and local stores should be synced all the time.
   * If there is a misalignment then simply replace the local copy with the global one.
   */
  useEffect(() => {
    config.provinces.join() !== provinces.join() && setProvinces(config.provinces);
    config.provinceOrder.join() !== provinceOrder.join() && setProvinceOrder(config.provinceOrder);
  }, [config]);

  const handleToggleRegion = province => () => {
    if (provinces.indexOf(province) > -1) {
      setProvinces(provinces.filter(p => p !== province));
    } else {
      setProvinces([...provinces, province]);
    }
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    setProvinceOrder(reorder(provinceOrder, result.source.index, result.destination.index));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Typography variant="h6" gutterBottom>Region</Typography>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <Grid
            container direction="column" alignItems="center" spacing={2}
            {...provided.droppableProps} ref={provided.innerRef}
            className={`${classes.root} ${snapshot.isDraggingOver && classes.dark}`}
          >
            {provinceOrder.map((province, index) => (
              <Draggable key={`region-btn-${province}`} draggableId={province} index={index}>
                {(provided, snapshot) => (
                  <>
                    <Grid
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={handleToggleRegion(province)}
                      className={classes.province}
                    >
                      <ColoredProvinceBox
                        province={province}
                        color={REGION_COLOR[province]}
                        selected={provinces.indexOf(province) > -1}
                      />
                    </Grid>
                  </>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Grid>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const useStyles = makeStyles(theme => ({
  root: props => ({
    position: 'relative',
    width: props.width || `calc(100% + ${theme.spacing(2)}px)`,
    padding: theme.spacing(1),
    border: '1px dashed transparent',
    borderRadius: theme.shape.borderRadius,
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '50%',
      width: 1,
      zIndex: 1,
      borderLeft: '1px solid #666',
    },
  }),
  // dark: { border: `1px dashed ${theme.palette.divider} !important` },
  province: {
    position: 'relative',
    height: 48,
    width: 48,
    zIndex: 2,
    padding: 6,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
}));

export default Region;
