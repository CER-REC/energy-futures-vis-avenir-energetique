import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import {
  makeStyles, Grid, Typography, Tooltip,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DragIcon from '@material-ui/icons/DragIndicator';
import Markdown from 'react-markdown';

import useConfig from '../../hooks/useConfig';
import { HintRegionList, HintSourceList } from '../Hint';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ColoredItemBox = ({
  item, label, icon, color, selected, clear, round, tooltip, disabled, isDragDisabled, ...gridProps
}) => {
  const classes = makeStyles(theme => ({
    root: props => ({
      position: 'absolute',
      height: 36,
      width: 36,
      backgroundColor: theme.palette.common.white,
      border: `2px solid ${color || theme.palette.secondary.main}`,
      borderRadius: round ? '50%' : 0,
      textTransform: 'uppercase',
      transition: 'box-shadow .25s ease-in-out',
      '& > p, & > svg': {
        margin: 'auto',
        color: color || theme.palette.secondary.main,
      },
      '&.selected': { backgroundColor: color || theme.palette.secondary.main },
      '&.selected > p, &.selected > svg': { color: theme.palette.common.white },
      '&:hover': { boxShadow: theme.shadows[6] },

      '&.disabled': {
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.common.white,
      },
      '&.disabled > p, &.disabled > svg': {
        color: theme.palette.secondary.main,
        backgroundColor: props.round ? 'transparent' : theme.palette.common.white,
        fontWeight: 700,
        lineHeight: 1,
        zIndex: 1,
      },
      '&.disabled:before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        height: 2,
        width: props.round ? '105%' : '152%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        backgroundColor: theme.palette.secondary.main,
        borderRadius: 1,
      },
      '&.disabled:hover': { boxShadow: theme.shadows[0] },
    }),
    btn: { margin: 'auto' },
    tooltip: {
      maxWidth: 350,
      fontSize: 10,
      lineHeight: 1,
      color: '#999',
      backgroundColor: theme.palette.common.white,
      border: '1px solid #AAA',
      borderRadius: 0,
      boxShadow: theme.shadows[1],
    },
  }))({ round });
  const Icon = icon;
  const styling = [classes.root, selected && 'selected', disabled && 'disabled'].filter(Boolean).join(' ');
  return (
    <Tooltip
      title={label && (
        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
          {!isDragDisabled && <Grid item><DragIcon fontSize="small" /></Grid>}
          <Grid item>
            <Typography variant="overline" component="div" style={{ lineHeight: tooltip ? 1.5 : 2.66 }}>
              <strong>{label}</strong>
            </Typography>
            {tooltip && <Typography variant="caption" color="secondary"><Markdown>{tooltip}</Markdown></Typography>}
          </Grid>
        </Grid>
      )}
      placement="right"
      classes={{ tooltip: classes.tooltip }}
    >
      <Grid container {...gridProps} className={styling}>
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
  icon: PropTypes.func,
  color: PropTypes.string,
  selected: PropTypes.bool,
  clear: PropTypes.bool,
  round: PropTypes.bool,
  tooltip: PropTypes.string,
  disabled: PropTypes.bool,
  isDragDisabled: PropTypes.bool,
};

ColoredItemBox.defaultProps = {
  label: '',
  icon: undefined,
  color: undefined,
  selected: false,
  clear: false,
  round: false,
  tooltip: undefined,
  disabled: false,
  isDragDisabled: false,
};

const useStyles = makeStyles(theme => ({
  root: props => ({
    position: 'relative',
    width: props.width || '100%',
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
  title: { fontSize: 13 },
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
  greyscale = false, /* ignore button colors */
  disabled = false, /* disable drag-n-drop */
  sourceType,
  items /* array of strings */,
  defaultItems /* object */,
  itemOrder /* array of strings */,
  defaultItemOrder /* array of strings */,
  disabledItems /* array of strings */,
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
    } else if (setItems) {
      setItems(itemOrder);
    }
  }, [singleSelect]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Generate translated tooltip text, if available.
   */
  const getTooltip = useCallback((item) => {
    const type = (config.page === 'by-sector' && config.sector === 'TRANSPORTATION') ? 'transportation' : sourceType;
    return sourceType && intl.formatMessage({ id: `sources.${type}.${item}` });
  }, [intl, sourceType, config.page, config.sector]);

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
      {title === 'Region' ? <HintRegionList items={defaultItems} /> : <HintSourceList sources={defaultItems} sourceType={sourceType} />}
      <Droppable droppableId="droppable" isDropDisabled={disabled}>
        {(provided, snapshot) => (
          <Grid
            container
            direction="column"
            alignItems="center"
            spacing={0}
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${classes.root} ${snapshot.isDraggingOver && classes.dark}`}
          >
            <Grid
              item
              onClick={handleToggleItem('ALL')}
              className={classes.item}
            >
              <ColoredItemBox
                item={allTitle}
                round={round}
                selected={singleSelect ? localItems[0] === 'ALL' : localItems.length > 0}
                clear={localItems.length === Object.keys(defaultItems).length}
              />
            </Grid>
            {localItemOrder.filter(item => defaultItems[item]).map((item, index) => (
              <Draggable key={`region-btn-${item}`} draggableId={item} index={index} isDragDisabled={disabled}>
                {providedItem => (
                  <>
                    <Grid
                      item
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
                        color={greyscale ? undefined : defaultItems[item].color}
                        selected={localItems.indexOf(item) > -1}
                        tooltip={getTooltip(item)}
                        disabled={disabledItems && disabledItems.includes(item)}
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
  greyscale: PropTypes.bool,
  disabled: PropTypes.bool,
  sourceType: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string),
  defaultItems: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  itemOrder: PropTypes.arrayOf(PropTypes.string),
  defaultItemOrder: PropTypes.arrayOf(PropTypes.string),
  disabledItems: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.bool]),
  setItems: PropTypes.func,
  setItemOrder: PropTypes.func,
};

DraggableVerticalList.defaultProps = {
  title: '',
  width: undefined,
  round: false,
  dense: false,
  singleSelect: false,
  greyscale: false,
  disabled: false,
  sourceType: undefined,
  items: [],
  defaultItems: {},
  itemOrder: [],
  defaultItemOrder: [],
  disabledItems: false,
  setItems: undefined,
  setItemOrder: undefined,
};

export default DraggableVerticalList;
