import React, { useContext, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  makeStyles, Grid, Typography, Checkbox,
} from '@material-ui/core';
import DragIcon from '@material-ui/icons/DragIndicator';

import { ConfigContext } from '../../containers/App/lazy';
import { PROVINCES, REGION_COLOR } from '../../types';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ColoredCheckbox = ({ color, ...props }) => {
  const classes = makeStyles(() => ({
    root: {
      color: color[400],
      '&:checked': { color: color[600] },
    },
  }))();
  return <Checkbox color="default" {...props} className={classes.root} />
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
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <Grid
            container direction="column" spacing={2}
            {...provided.droppableProps} ref={provided.innerRef}
            className={`${classes.root} ${snapshot.isDraggingOver && classes.dark}`}
          >
            <Grid item>
              <Typography variant="h6">Region</Typography>
            </Grid>
            {provinceOrder.map((province, index) => (
              <Draggable key={`region-btn-${province}`} draggableId={province} index={index}>
                {(provided, snapshot) => (
                  <Grid item>
                    <Grid
                      container ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      alignItems="center"
                      wrap="nowrap"
                      spacing={1}
                      className={`${classes.region} ${snapshot.isDragging && classes.dragging}`}
                    >
                      <Grid item style={{ display: 'flex' }}><DragIcon /></Grid>
                      <Grid item style={{ flexGrow: 1 }}><Typography variant="body2">{province}</Typography></Grid>
                      <Grid item style={{ display: 'flex' }}>
                        <ColoredCheckbox
                          color={REGION_COLOR[province]}
                          checked={provinces.indexOf(province) > -1}
                          onChange={handleToggleRegion(province)}
                          classes={{ root: classes.color }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
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
    width: props.width || `calc(100% + ${theme.spacing(2)}px)`,
    padding: theme.spacing(1),
    border: '1px dashed transparent',
    borderRadius: theme.shape.borderRadius,
  }),
  dark: { border: `1px dashed ${theme.palette.divider} !important` },
  region: {
    width: 125,
    padding: theme.spacing(0, .5),
    border: '1px solid #EEE',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'white',
    transition: 'background-color .25s ease-in-out, box-shadow .25s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[1],
    },
  },
  dragging: {
    backgroundColor: '#EFEFEF',
    boxShadow: theme.shadows[4],
  },
}));

export default Region;
