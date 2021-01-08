import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Tooltip, Typography } from '@material-ui/core';
import DragIcon from '@material-ui/icons/DragIndicator';
import Markdown from 'react-markdown';

import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import { HintRegionList, HintSourceList } from '../Hint';
import ColoredItemBox from './ColoredItemBox';
import OilSubgroup from './OilSubgroup';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
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
    '&.oil-sub-group': { height: 180 },
  }),
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
   * Determine whether or not 'transportation' is the current selected sector.
   * This will be later used in generating tooltips and the subgroup.
   */
  const isTransportation = useMemo(() => config.page === 'by-sector' && config.sector === 'TRANSPORTATION', [config.page, config.sector]);

  /**
   * Generate translated tooltip text, if available.
   */
  const getTooltip = useCallback((item) => {
    const type = isTransportation ? 'transportation' : sourceType;
    return sourceType && intl.formatMessage({ id: `sources.${type}.${item}` });
  }, [intl, sourceType, isTransportation]);

  const handleToggleItem = toggledItem => () => {
    // capture the event for data analytics
    analytics.reportFeature(config.page, title === 'Region' ? 'region' : 'source', toggledItem.toLowerCase());

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
      {title === 'Region' ? <HintRegionList items={defaultItems} disableKeyboardNav={disabled} /> : <HintSourceList sources={defaultItems} sourceType={sourceType} disableKeyboardNav={disabled} />}
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
            {/* the 'ALL' box */}
            <Grid
              item
              onClick={handleToggleItem('ALL')}
              onKeyPress={event => event.key === 'Enter' && handleToggleItem('ALL')()}
              tabIndex={0}
              className={classes.item}
            >
              <ColoredItemBox
                item={allTitle}
                round={round}
                selected={singleSelect ? localItems[0] === 'ALL' : localItems.length > 0}
                clear={localItems.length === Object.keys(defaultItems).length}
              />
            </Grid>

            {/* individual boxes */}
            {localItemOrder.filter(item => defaultItems[item]).map((item, index) => (
              <Draggable key={`region-btn-${item}`} draggableId={item} index={index} isDragDisabled={disabled}>
                {(providedItem) => {
                  const tooltip = getTooltip(item);
                  return (
                    <Tooltip
                      title={defaultItems[item]?.label && (
                        <Grid container alignItems="center" wrap="nowrap" spacing={1}>
                          {!disabled && <Grid item><DragIcon fontSize="small" /></Grid>}
                          <Grid item>
                            <Typography variant="overline" component="div" style={{ lineHeight: tooltip ? 1.5 : 2.66 }}>
                              <strong>{defaultItems[item].label}</strong>
                            </Typography>
                            {tooltip && <Typography variant="caption" color="secondary"><Markdown>{tooltip}</Markdown></Typography>}
                          </Grid>
                        </Grid>
                      )}
                      placement="right"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <Grid
                        item
                        ref={providedItem.innerRef}
                        {...providedItem.draggableProps}
                        {...providedItem.dragHandleProps}
                        onClick={handleToggleItem(item)}
                        onKeyPress={event => event.key === 'Enter' && handleToggleItem(item)()}
                        tabIndex={0}
                        className={`${classes.item} ${isTransportation && item === 'OIL' && 'oil-sub-group'}`}
                      >
                        <ColoredItemBox
                          item={intl.formatMessage({ id: `components.draggableVerticalList.abbr.${item}`, defaultMessage: item })}
                          round={round}
                          icon={defaultItems[item].icon}
                          color={greyscale ? undefined : defaultItems[item].color}
                          selected={localItems.indexOf(item) > -1}
                          attachment={isTransportation && item === 'OIL' && <OilSubgroup selected={localItems.indexOf(item) > -1} />}
                          disabled={disabledItems && disabledItems.includes(item)}
                          draggable={!disabled}
                        />
                      </Grid>
                    </Tooltip>
                  );
                }}
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
