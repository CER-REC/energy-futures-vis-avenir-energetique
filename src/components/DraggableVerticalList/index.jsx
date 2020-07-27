import React, { useContext, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  makeStyles, Grid, Typography,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import ClearIcon from '@material-ui/icons/Clear';
import DragIcon from '@material-ui/icons/DragIndicator';

import { ConfigContext } from '../../containers/App/lazy';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ColoredItemBox = ({ item, label, icon, color, selected, clear, round, left, ...props }) => {
  const classes = makeStyles(theme => ({
    root: {
      position: 'absolute',
      height: 36,
      width: 36,
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${color[600]}`,
      borderRadius: round ? '50%' : 0,
      transition: 'box-shadow .25s ease-in-out',
      '& > p, & > svg': {
        margin: 'auto',
        color: color[800],
      },
      '&.selected': { backgroundColor: color[600] },
      '&.selected > p, &.selected > svg': { color: theme.palette.common.white },
      '&:hover': { boxShadow: theme.shadows[6] },

      '& > div': {
        position: 'absolute',
        left: left ? 'auto' : 36,
        right: left ? 36 : 'auto',
        top: '50%',
        color: '#666',
        opacity: 0,
        transition: 'opacity .25s ease-in-out',
        transform: 'translateY(-50%)',
      },
      '&:hover > div': { opacity: 1 },
      '& > div > span': {
        padding: 4,
        lineHeight: 1,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #AAA',
      },
    },
    btn: { margin: 'auto' },
  }))();
  const Icon = icon;
  return (
    <Grid container {...props} className={`${classes.root} ${selected && 'selected'}`}>
      {clear
        ? <ClearIcon className={classes.btn} />
        : icon ? <Icon className={classes.btn} /> : <Typography variant="body2">{item}</Typography>}
      {label && (
        <Grid container direction={left ? 'row-reverse' : 'row'} alignItems="center" wrap="nowrap">
          <DragIcon fontSize="small" />
          <Typography variant="overline">{label}</Typography>
        </Grid>
      )}
    </Grid>
  );
};

const DraggableVerticalList = ({
  title, width, round, left, dense,
  items /* array of strings */,
  defaultItems /* object */,
  itemOrder /* array of strings */,
  defaultItemOrder /* array of strings */,
  setItems /* (localItems) => void */,
  setItemOrder /* (localItemOrder) => void */,
}) => {
  const classes = useStyles({ width, dense });

  const { config } = useContext(ConfigContext);

  const [localItems, setLocalItems] = useState(items || Object.keys(defaultItems));
  const [localItemOrder, setLocalItemOrder] = useState(itemOrder || defaultItemOrder);

  /**
   * Update the global store if the local copy modified.
   */
  useEffect(() => { setItems && setItems(localItems) }, [localItems]);
  useEffect(() => { setItemOrder && setItemOrder(localItemOrder) }, [localItemOrder]);

  /**
   * The global and local stores should be synced all the time.
   * If there is a misalignment then simply replace the local copy with the global one.
   */
  useEffect(() => {
    items.join() !== localItems.join() && setLocalItems(items);
    itemOrder.join() !== localItemOrder.join() && setLocalItemOrder(itemOrder);
  }, [config]);

  const handleToggleItem = toggledItem => () => {
    if (toggledItem === 'ALL') {
      setLocalItems(localItems.length === Object.keys(defaultItems).length ? [] : Object.keys(defaultItems)); // default values
      return;
    }
    if (localItems.indexOf(toggledItem) > -1) {
      setLocalItems(localItems.filter(i => i !== toggledItem));
    } else {
      setLocalItems([...localItems, toggledItem]);
    }
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    setLocalItemOrder(reorder(localItemOrder, result.source.index, result.destination.index));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <Grid
            container direction="column" alignItems="center" spacing={2}
            {...provided.droppableProps} ref={provided.innerRef}
            className={`${classes.root} ${snapshot.isDraggingOver && classes.dark}`}
          >
            <Grid
              onClick={handleToggleItem('ALL')}
              className={classes.item}
            >
              <ColoredItemBox
                item="ALL" round={round} left={left}
                color={grey}
                selected={localItems.length > 0}
                clear={localItems.length === Object.keys(defaultItems).length}
              />
            </Grid>
            {localItemOrder.map((item, index) => (
              <Draggable key={`region-btn-${item}`} draggableId={item} index={index}>
                {(provided, snapshot) => (
                  <>
                    <Grid
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={handleToggleItem(item)}
                      className={classes.item}
                    >
                      <ColoredItemBox
                        item={item} round={round} left={left}
                        label={defaultItems[item].label}
                        icon={defaultItems[item].icon}
                        color={defaultItems[item].color || grey}
                        selected={localItems.indexOf(item) > -1}
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
    marginTop: props.dense ? 0 : -4,
    border: '1px dashed transparent',
    borderRadius: theme.shape.borderRadius,
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 16,
      bottom: 16,
      left: 'calc(50% - 1px)',
      width: 1,
      zIndex: 1,
      borderLeft: '2px solid #888',
    },
  }),
  item: props => ({
    position: 'relative',
    height: props.dense ? 44 : 52,
    width: props.dense ? 44 : 52,
    zIndex: 2,
    padding: props.dense ? 4 : 8,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  }),
}));

export default DraggableVerticalList;
