import React, { useMemo, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import {
  makeStyles, Grid, Typography, Tooltip,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import ClearIcon from '@material-ui/icons/Clear';
import DragIcon from '@material-ui/icons/DragIndicator';
import { useIntl } from 'react-intl';

import useConfig from '../../hooks/useConfig';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ColoredItemBox = ({
  item, label, icon, color, selected, clear, round, isDragDisabled, ...props
}) => {
  const classes = makeStyles(theme => ({
    root: {
      position: 'absolute',
      height: 36,
      width: 36,
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${color[600] || color || theme.palette.secondary.main}`,
      borderRadius: round ? '50%' : 0,
      textTransform: 'uppercase',
      transition: 'box-shadow .25s ease-in-out',
      '& > p, & > svg': {
        margin: 'auto',
        color: color[800] || color || theme.palette.secondary.main,
      },
      '&.selected': { backgroundColor: color[600] || color || theme.palette.secondary.main },
      '&.selected > p, &.selected > svg': { color: theme.palette.common.white },
      '&:hover': { boxShadow: theme.shadows[6] },
    },
    btn: { margin: 'auto' },
    tooltip: disabled => ({
      margin: theme.spacing(0, 1),
      paddingLeft: disabled ? 4 : 0,
      fontSize: 10,
      lineHeight: 1,
      color: '#999',
      backgroundColor: theme.palette.common.white,
      border: '1px solid #AAA',
      borderRadius: 0,
      boxShadow: theme.shadows[1],
      '& span': { marginLeft: theme.spacing(0.5) },
    }),
  }))(isDragDisabled);
  const Icon = icon;
  return (
    <Tooltip
      title={label && (
        <Grid container alignItems="center" wrap="nowrap">
          {!isDragDisabled && <DragIcon fontSize="small" />}
          <Typography variant="overline">{label}</Typography>
        </Grid>
      )}
      placement="right"
      classes={{ tooltip: classes.tooltip }}
    >
      <Grid container {...props} className={`${classes.root} ${selected && 'selected'}`}>
        {clear && <ClearIcon className={classes.btn} />}
        {!clear && icon && <Icon className={classes.btn} />}
        {!clear && !icon && <Typography variant="body2">{item}</Typography>}
      </Grid>
    </Tooltip>
  );
};

ColoredItemBox.propTypes = {
  item: PropTypes.string.isRequired,
  label: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  icon: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  color: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  selected: PropTypes.bool,
  clear: PropTypes.bool,
  round: PropTypes.bool,
  isDragDisabled: PropTypes.bool,
};

ColoredItemBox.defaultProps = {
  label: '',
  icon: undefined,
  color: undefined,
  selected: false,
  clear: false,
  round: false,
  isDragDisabled: false,
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
      display: props.disabled ? 'none' : 'block',
      position: 'absolute',
      top: 16,
      bottom: 16,
      left: 'calc(50% - 1px)',
      width: 1,
      zIndex: 1,
      borderLeft: `2px solid ${theme.palette.secondary.main}`,
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

const DraggableVerticalList = ({
  title, width, round, dense,
  singleSelect = false, /* multi-select or single select */
  disabled = false, /* disable drag-n-drop */
  items /* array of strings */,
  defaultItems /* object */,
  itemOrder /* array of strings */,
  defaultItemOrder /* array of strings */,
  setItems /* (localItems) => void */,
  setItemOrder /* (localItemOrder) => void */,
}) => {
  const intl = useIntl();
  const classes = useStyles({ width, dense, disabled });
  const { config } = useConfig();
  const [localItems, setLocalItems] = useState(items || Object.keys(defaultItems));
  const [localItemOrder, setLocalItemOrder] = useState(itemOrder || defaultItemOrder);
  const allTitle = useMemo(
    () => intl.formatMessage({ id: 'components.draggableVerticalList.all' }),
    [intl],
  );

  /**
   * Update the global store if the local copy modified.
   */
  useEffect(
    () => { if (setItems) { setItems(localItems); } },
    [localItems], // eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(
    () => { if (setItemOrder) { setItemOrder(localItemOrder); } },
    [localItemOrder], // eslint-disable-line react-hooks/exhaustive-deps
  );

  /**
   * The global and local stores should be synced all the time.
   * If there is a misalignment then simply replace the local copy with the global one.
   */
  useEffect(
    () => {
      if (items.join() !== localItems.join()) {
        setLocalItems(singleSelect ? ['ALL'] : items);
      }
      if (itemOrder.join() !== localItemOrder.join()) {
        setLocalItemOrder(itemOrder);
      }
    },
    [config], // eslint-disable-line react-hooks/exhaustive-deps
  );

  /**
   * Switch between single- vs. multi-select.
   */
  useEffect(() => {
    if (singleSelect) {
      setLocalItems(localItems.length === 1 ? localItems : ['ALL']);
    }
  }, [singleSelect]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleItem = toggledItem => () => {
    if (singleSelect) {
      setLocalItems([toggledItem]);
      return;
    }
    if (toggledItem === 'ALL') {
      setLocalItems(localItems.length === Object.keys(defaultItems).length
        ? []
        : Object.keys(defaultItems)); // default values
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
      <Typography variant="h6" color="secondary" gutterBottom>{title}</Typography>
      <Droppable droppableId="droppable" isDropDisabled={disabled}>
        {(provided, snapshot) => (
          <Grid
            container
            direction="column"
            alignItems="center"
            spacing={2}
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${classes.root} ${snapshot.isDraggingOver && classes.dark}`}
          >
            <Grid
              onClick={handleToggleItem('ALL')}
              className={classes.item}
            >
              <ColoredItemBox
                item={allTitle}
                round={round}
                color={grey}
                selected={singleSelect ? localItems[0] === 'ALL' : localItems.length > 0}
                clear={localItems.length === Object.keys(defaultItems).length}
              />
            </Grid>
            {localItemOrder.map((item, index) => (
              <Draggable key={`region-btn-${item}`} draggableId={item} index={index} isDragDisabled={disabled}>
                {providedItem => (
                  <>
                    <Grid
                      ref={providedItem.innerRef}
                      {...providedItem.draggableProps}
                      {...providedItem.dragHandleProps}
                      onClick={handleToggleItem(item)}
                      className={classes.item}
                    >
                      <ColoredItemBox
                        item={item}
                        round={round}
                        label={defaultItems[item].label}
                        icon={defaultItems[item].icon}
                        color={defaultItems[item].color}
                        selected={localItems.indexOf(item) > -1}
                        isDragDisabled={disabled}
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

DraggableVerticalList.propTypes = {
  title: PropTypes.string,
  width: PropTypes.number,
  round: PropTypes.bool,
  dense: PropTypes.bool,
  singleSelect: PropTypes.bool,
  disabled: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.string),
  defaultItems: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  itemOrder: PropTypes.arrayOf(PropTypes.string),
  defaultItemOrder: PropTypes.arrayOf(PropTypes.string),
  setItems: PropTypes.func,
  setItemOrder: PropTypes.func,
};

DraggableVerticalList.defaultProps = {
  title: '',
  width: undefined,
  round: false,
  dense: false,
  singleSelect: false,
  disabled: false,
  items: [],
  defaultItems: {},
  itemOrder: [],
  defaultItemOrder: [],
  setItems: undefined,
  setItemOrder: undefined,
};

export default DraggableVerticalList;
