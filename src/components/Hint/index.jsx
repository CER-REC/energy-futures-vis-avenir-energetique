import React, { useState, useMemo, Fragment } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles,
  Grid, Typography, IconButton, Fab, Dialog, DialogContent, Divider,
} from '@material-ui/core';
import HintIcon from '@material-ui/icons/HelpOutline';
import CloseIcon from '@material-ui/icons/Close';
import Markdown from 'react-markdown';

import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CONFIG_LAYOUT } from '../../constants';
import analytics from '../../analytics';

const useStyles = makeStyles(theme => createStyles({
  root: { width: 'auto' },
  dialog: {
    overflow: 'visible',
    '& p, & ul': { margin: 0 },
  },
  hint: {
    height: 28,
    margin: 'auto',
    padding: theme.spacing(0.5),
    color: theme.palette.secondary.light,
    transform: 'translateY(-6px)',
  },
  close: {
    position: 'absolute',
    top: -24,
    right: -24,
    zIndex: 1,
    'button&': { height: 48 },
  },
}));

/**
 * A single section in the hint dialog content, including a section title and a list of body text.
 */
const HintSection = ({ title, section, singleColumn }) => (
  <Grid container alignItems={singleColumn ? 'center' : 'flex-start'} spacing={2}>
    {title && <Grid item xs={12}><Typography variant="h4">{title}</Typography></Grid>}
    {section.map(entry => (singleColumn ? (
      <Fragment key={`hint-content-entry-${Math.random()}`}>
        <Grid item xs={12} sm={4}>
          <Grid container alignItems="center" wrap="nowrap">
            {entry.icon && <entry.icon style={{ verticalAlign: 'middle', marginRight: 8 }} />}
            <Typography variant="body1" component="span"><strong>{entry.title}</strong></Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="body2" color="secondary" component="span"><Markdown>{entry.text}</Markdown></Typography>
          {entry.link && <Typography variant="body2" color="secondary" component="span"><Markdown>{entry.link}</Markdown></Typography>}
        </Grid>
      </Fragment>
    ) : (
      <Grid item xs={section.length < 3 ? 12 : 6} key={`hint-content-entry-${Math.random()}`}>
        {entry.title && <Typography variant="h6" gutterBottom>{entry.title}</Typography>}
        <Typography variant="body2" color="secondary" component="span"><Markdown>{entry.text}</Markdown></Typography>
        {entry.link && <Typography variant="body2" color="secondary" component="span"><Markdown>{entry.link}</Markdown></Typography>}
      </Grid>
    )))}
  </Grid>
);

HintSection.propTypes = {
  title: PropTypes.string,
  section: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    icon: PropTypes.func,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    link: PropTypes.node,
  })),
  singleColumn: PropTypes.bool,
};

HintSection.defaultProps = {
  title: undefined,
  section: undefined,
  singleColumn: false,
};

/**
 * Construct and render the hint icon (question mark) and its dialog.
 */
const Hint = ({ children, label, content, maxWidth = 'sm' }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { page } = useConfig().config;
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    if (label) {
      analytics.reportHelp(page, label);
    }
    setOpen(true);
  };

  return (
    <>
      <Grid container alignItems="center" wrap="nowrap" className={classes.root}>
        {children}
        <IconButton onClick={handleOpenDialog} aria-label={intl.formatMessage({ id: 'common.a11y.open' })} className={classes.hint}>
          <HintIcon fontSize="small" />
        </IconButton>
      </Grid>

      <Dialog
        open={open}
        maxWidth={maxWidth}
        onClose={() => setOpen(false)}
        classes={{ paper: classes.dialog }}
      >
        <Fab color="primary" size="medium" onClick={() => setOpen(false)} aria-label={intl.formatMessage({ id: 'common.a11y.close' })} className={classes.close}>
          <CloseIcon />
        </Fab>
        <DialogContent style={{ padding: 24 }}>
          {typeof content === 'string' ? content : (
            <Grid container direction="column" spacing={1}>
              {(content || []).map(section => <Grid item key={`hint-content-section-${Math.random()}`}>{section}</Grid>)}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

Hint.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  maxWidth: PropTypes.string,
};

Hint.defaultProps = {
  children: null,
  label: '',
  content: 'under construction',
  maxWidth: 'sm',
};

export default Hint;

/**
 * Hint panel for the main selection question mark.
 */
export const HintMainSelect = ({ children }) => {
  const intl = useIntl();
  const { page } = useConfig().config;
  const section = useMemo(() => Object.keys(CONFIG_LAYOUT).filter(
    selection => CONFIG_LAYOUT[selection].pages.includes(page),
  ).map(selection => ({
    title: intl.formatMessage({ id: `components.mainSelect.${selection}.title` }),
    text: intl.formatMessage({ id: `components.mainSelect.${selection}.description` }),
  })), [intl, page]);
  return <Hint label="main selection" content={[<HintSection section={section} />]}>{children}</Hint>;
};

HintMainSelect.propTypes = { children: PropTypes.node };
HintMainSelect.defaultProps = { children: null };

/**
 * Hint panel for the year selection question mark.
 */
export const HintYearSelect = ({ children }) => {
  const intl = useIntl();
  const { yearIdIterations } = useAPI();
  const section = useMemo(() => Object.keys(yearIdIterations).sort().reverse().map(year => ({
    title: intl.formatMessage({ id: `components.yearSelect.${year}.title` }),
    text: `
**${intl.formatMessage({ id: `components.yearSelect.${year}.subtitle` })}**\n\n\
${intl.formatMessage({ id: `components.yearSelect.${year}.description` })}\
    `,
    link: intl.formatMessage({ id: `components.yearSelect.${year}.link` }),
  })), [intl, yearIdIterations]);
  const content = <HintSection title={intl.formatMessage({ id: 'components.yearSelect.title' })} section={section} />;
  return <Hint label="year" content={[content]} maxWidth="lg">{children}</Hint>;
};

HintYearSelect.propTypes = { children: PropTypes.node };
HintYearSelect.defaultProps = { children: null };

/**
 * Hint panel for the scenario selection question mark.
 */
export const HintScenarioSelect = ({ children }) => {
  const intl = useIntl();
  const { yearIdIterations } = useAPI();
  const { yearId } = useConfig().config;
  const sectionTitle = useMemo(
    () => [{ text: intl.formatMessage({ id: `components.scenarioSelect.description.${yearId}` }) }],
    [intl, yearId],
  );
  const sectionBody = useMemo(() => (yearIdIterations[yearId]?.scenarios || []).map(scenario => ({
    title: intl.formatMessage({ id: `common.scenarios.${scenario}` }),
    text: intl.formatMessage({
      id: `components.scenarioSelect.${scenario}.description.${yearId}`,
      defaultMessage: intl.formatMessage({ id: `components.scenarioSelect.${scenario}.description.default` }),
    }),
  })), [intl, yearIdIterations, yearId]);
  const sections = [
    <HintSection title={intl.formatMessage({ id: 'components.scenarioSelect.name' })} section={sectionTitle} />,
    <HintSection section={sectionBody} />,
  ];
  return <Hint label="scenarios" content={sections}>{children}</Hint>;
};

HintScenarioSelect.propTypes = { children: PropTypes.node };
HintScenarioSelect.defaultProps = { children: null };

/**
 * Hint panel for the unit selection question mark, which contains 2 sections.
 */
export const HintUnitSelect = ({ children }) => {
  const intl = useIntl();
  const unitEnergy = useMemo(() => ['petajoules', 'kilobarrelEquivalents', 'gigawattHours'].map(unit => ({
    title: `${intl.formatMessage({ id: `components.unitSelect.${unit}.title` })} (${intl.formatMessage({ id: `common.units.${unit}` })})`,
    text: intl.formatMessage({ id: `components.unitSelect.${unit}.description` }),
  })), [intl]);
  const unitVolume = useMemo(() => ['kilobarrels', 'thousandCubicMetres', 'cubicFeet', 'millionCubicMetres'].map(unit => ({
    title: `${intl.formatMessage({ id: `components.unitSelect.${unit}.title` })} (${intl.formatMessage({ id: `common.units.${unit}` })})`,
    text: intl.formatMessage({ id: `components.unitSelect.${unit}.description` }),
  })), [intl]);
  const content = [
    <HintSection title={intl.formatMessage({ id: 'common.energyUnits' })} section={unitEnergy} />,
    <HintSection title={intl.formatMessage({ id: 'common.volumetricUnits' })} section={unitVolume} />,
  ];
  return <Hint label="unit" content={content} maxWidth="md">{children}</Hint>;
};

HintUnitSelect.propTypes = { children: PropTypes.node };
HintUnitSelect.defaultProps = { children: null };

/**
 * Hint panel for the sector selection question mark.
 */
export const HintSectorSelect = ({ children }) => {
  const intl = useIntl();
  const { sectors } = useAPI();
  const section = useMemo(() => sectors.order.map(sector => ({
    title: intl.formatMessage({ id: `common.sectors.${sector}` }),
    text: intl.formatMessage({ id: `components.sectorSelect.${sector}.description` }),
  })).filter(Boolean), [intl, sectors]);
  return <Hint label="sector" content={[<HintSection title={intl.formatMessage({ id: 'components.sectorSelect.name' })} section={section} />]}>{children}</Hint>;
};

HintSectorSelect.propTypes = { children: PropTypes.node };
HintSectorSelect.defaultProps = { children: null };

/**
 * Hint panel for the view selection question mark.
 */
export const HintViewSelect = ({ children }) => {
  const intl = useIntl();
  const { page } = useConfig().config;
  const section = useMemo(() => ['region', 'source'].map(view => ({
    title: intl.formatMessage({ id: `common.${view === 'source' && page === 'oil-and-gas' ? 'type' : view}` }),
    text: intl.formatMessage({ id: `components.viewSelect.${view}.description.${page}` }),
  })), [intl, page]);
  return <Hint label="view by" content={[<HintSection title={intl.formatMessage({ id: 'components.viewSelect.name' })} section={section} />]}>{children}</Hint>;
};

HintViewSelect.propTypes = { children: PropTypes.node };
HintViewSelect.defaultProps = { children: null };

const HintSectionNav = () => {
  const intl = useIntl();
  const section = useMemo(() => [{
    title: intl.formatMessage({ id: 'components.draggableVerticalList.keyboardNav.title' }),
    text: intl.formatMessage({ id: 'components.draggableVerticalList.keyboardNav.description' }),
  }], [intl]);
  return <HintSection section={section} />;
};

/**
 * Hint panel for the question mark on top of the draggable region list.
 */
export const HintRegionList = ({ children, disableKeyboardNav }) => {
  const intl = useIntl();
  const { regions } = useAPI();
  const list = useMemo(() => ['ALL', ...regions.order].map(region => ({
    title: region === 'ALL'
      ? intl.formatMessage({ id: 'components.draggableVerticalList.all' })
      : region,
    text: intl.formatMessage({ id: `common.regions.${region}` }),
  })), [intl, regions]);
  const sections = [
    <HintSection section={list} singleColumn />,
    !disableKeyboardNav && <Divider style={{ margin: '16px 0' }} />,
    !disableKeyboardNav && <HintSectionNav />,
  ];
  return <Hint label="region" content={sections} maxWidth="xs">{children}</Hint>;
};

HintRegionList.propTypes = {
  children: PropTypes.node,
  disableKeyboardNav: PropTypes.bool.isRequired,
};
HintRegionList.defaultProps = { children: null };

/**
 * Hint panel for the question mark on top of the draggable source list.
 */
export const HintSourceList = ({ sources, sourceType, children, disableKeyboardNav }) => {
  const intl = useIntl();
  const list = useMemo(() => Object.keys(sources).map(source => ({
    title: sources[source].label,
    icon: sources[source].icon,
    text: intl.formatMessage({ id: `sources.${sourceType}.${source}` }),
  })), [intl, sources, sourceType]);
  const sections = [
    <HintSection section={list} singleColumn />,
    !disableKeyboardNav && <Divider style={{ margin: '16px 0' }} />,
    !disableKeyboardNav && <HintSectionNav />,
  ];
  return <Hint label="source" content={sections}>{children}</Hint>;
};

HintSourceList.propTypes = {
  sources: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  sourceType: PropTypes.string.isRequired,
  disableKeyboardNav: PropTypes.bool.isRequired,
  children: PropTypes.node,
};
HintSourceList.defaultProps = { children: null };
