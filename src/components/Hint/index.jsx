import React, { useState, useMemo, Fragment, useCallback, cloneElement } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  makeStyles, createStyles,
  Grid, Typography, IconButton, Fab, Dialog, DialogContent, Divider,
} from '@material-ui/core';
import HintIcon from '@material-ui/icons/HelpOutline';
import CloseIcon from '@material-ui/icons/Close';
import Markdown from 'react-markdown';

import clsx from 'clsx';
import useAPI from '../../hooks/useAPI';
import useConfig from '../../hooks/useConfig';
import { CONFIG_LAYOUT, SCENARIO_LABEL_COLOR } from '../../constants';
import analytics from '../../analytics';
import ScenarioHintImageEn from './scenario_hint_en.jpg';
import ScenarioHintImageFr from './scenario_hint_fr.jpg';

const useStyles = makeStyles(theme => createStyles({
  root: { width: 'auto' },
  dialog: {
    overflow: 'visible',
    '& p, & ul': { margin: 0 },
  },
  hint: {
    height: 28,
    margin: '4px 10px 4px 2px',
    padding: 0,
    color: theme.palette.secondary.light,
    '&.standalone': {
      margin: 'auto',
      padding: theme.spacing(0.5),
    },
  },
  scenarios: {
    '& img': {
      width: '100%',
      maxWidth: 500,
      padding: theme.spacing(1),
    },
    '& hr': { margin: theme.spacing(1.5, 0) },
  },
  close: {
    position: 'absolute',
    top: -24,
    right: -24,
    zIndex: 1,
    'button&': { height: 48 },
  },
  paragraphSpacing: {
    '& span > p:nth-child(2) ~ p': {
      paddingTop: '1em',
    },
  },
}));

/**
 * A single section in the hint dialog content, including a section title and a list of body text.
 */
const HintSection = ({ title, section, singleColumn }) => {
  const classes = useStyles();
  return (
    <Grid container alignItems={singleColumn ? 'center' : 'flex-start'} spacing={2}>
      {title && <Grid item xs={12}><Typography variant="h4">{title}</Typography></Grid>}
      {section.map(entry => (singleColumn ? (
        <Fragment key={`hint-content-entry-${Math.random()}`}>
          <Grid item xs={12} sm={4}>
            <Grid container alignItems="center" wrap="nowrap" spacing={1}>
              {entry.icon && <Grid item><entry.icon style={{ verticalAlign: 'middle' }} /></Grid>}
              <Grid item><Typography variant="body1" component="span"><strong>{entry.title}</strong></Typography></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="body2" color="secondary" component="span"><Markdown>{entry.text}</Markdown></Typography>
            {entry.link && <Typography variant="body2" color="secondary" component="span"><Markdown>{entry.link}</Markdown></Typography>}
          </Grid>
        </Fragment>
      ) : (
        <Grid item xs={section.length < 3 ? 12 : 6} key={`hint-content-entry-${Math.random()}`}>
          <Grid container wrap="nowrap" spacing={1}>
            {entry.color && (
            <Grid item>
              <div style={{ height: 12, width: 12, marginTop: 10, backgroundColor: entry.color }} />
            </Grid>
            )}
            <Grid className={classes.paragraphSpacing} item>
              {entry.title && <Typography variant="h6" gutterBottom>{entry.title}</Typography>}
              <Typography variant="body2" color="secondary" component="span"><Markdown>{entry.text}</Markdown></Typography>
              {entry.link && <Typography variant="body2" color="secondary" component="span"><Markdown>{entry.link}</Markdown></Typography>}
            </Grid>
          </Grid>
        </Grid>
      )))}
    </Grid>
  );
};

HintSection.propTypes = {
  title: PropTypes.string,
  section: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    color: PropTypes.string, // for scenario panel
    icon: PropTypes.func, // for source list panel
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
const Hint = ({ children, label, content, maxWidth = 'sm', className, isTextButton, isStandaloneButton = false }) => {
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
        {
          isTextButton && (
            cloneElement(children, { onClick: handleOpenDialog })
          )
        }
        {
          !isTextButton && (
            <>
              {children}
              <IconButton
                onClick={handleOpenDialog}
                aria-label={intl.formatMessage({ id: 'common.a11y.open' })}
                className={clsx(classes.hint, { standalone: isStandaloneButton })}
              >
                <HintIcon fontSize="small" />
              </IconButton>
            </>
          )
        }
      </Grid>

      <Dialog
        open={open}
        maxWidth={maxWidth}
        onClose={() => setOpen(false)}
        classes={{ paper: `${classes.dialog} ${className}`.trim() }}
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
  className: PropTypes.string, // inject extra className for additional styling in the dialog
  isTextButton: PropTypes.bool,
  isStandaloneButton: PropTypes.bool,
};

Hint.defaultProps = {
  children: null,
  label: '',
  content: 'under construction',
  maxWidth: 'sm',
  className: '',
  isTextButton: false,
  isStandaloneButton: false,
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
 * Hint panel for the sector selection question mark.
 */
export const HintSectorSelect = ({ children }) => {
  const intl = useIntl();
  const { sectors } = useAPI();
  const section = useMemo(() => sectors.map(sector => ({
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
  return <Hint label="view by" content={[<HintSection title={intl.formatMessage({ id: 'components.viewSelect.viewBy' })} section={section} />]}>{children}</Hint>;
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
  return <Hint label="region" content={sections} maxWidth="xs" isStandaloneButton>{children}</Hint>;
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
  const { config: { yearId } } = useConfig();
  const getText = useCallback((source) => {
    if ((sourceType === 'energy') && (source === 'BIO') && (parseInt(yearId, 10) > 2020)) {
      return intl.formatMessage({ id: 'sources.energy.BIO_UPDATED' });
    }
    return intl.formatMessage({ id: `sources.${sourceType}.${source}` });
  }, [intl, sourceType, yearId]);

  const list = useMemo(() => Object.keys(sources).map(source => ({
    title: sources[source].label,
    icon: sources[source].icon,
    text: getText(source),
  })), [sources, getText]);
  const sections = [
    <HintSection section={list} singleColumn />,
    !disableKeyboardNav && <Divider style={{ margin: '16px 0' }} />,
    !disableKeyboardNav && <HintSectionNav />,
  ];
  return <Hint label="source" content={sections} isStandaloneButton>{children}</Hint>;
};

HintSourceList.propTypes = {
  sources: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  sourceType: PropTypes.string.isRequired,
  disableKeyboardNav: PropTypes.bool.isRequired,
  children: PropTypes.node,
};
HintSourceList.defaultProps = { children: null };

export const HintScenarioSelect = ({ children, isTextButton }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { yearIdIterations } = useAPI();
  const { yearId } = useConfig().config;

  const showGraph = useMemo(
    () => (yearIdIterations[yearId]?.scenarios || []).find(title => title === 'Evolving'),
    [yearIdIterations, yearId],
  );
  const sectionTitle = useMemo(
    () => [{ text: intl.formatMessage({ id: `components.scenarioSelect.description.${yearId}` }) }],
    [intl, yearId],
  );
  const sectionBody = useMemo(() => (yearIdIterations[yearId]?.scenarios || []).map(scenario => ({
    title: intl.formatMessage({
      id: `common.scenarios.${scenario}.${yearId}`,
      defaultMessage: intl.formatMessage({ id: `common.scenarios.${scenario}` }),
    }),
    text: intl.formatMessage({
      id: `components.scenarioSelect.${scenario}.description.${yearId}`,
      defaultMessage: intl.formatMessage({ id: `components.scenarioSelect.${scenario}.description.default` }),
    }),
    color: showGraph && SCENARIO_LABEL_COLOR[scenario],
  })), [intl, yearIdIterations, yearId, showGraph]);
  const sectionCaption = useMemo(() => ['netzero', 'history'].map(caption => ({
    title: intl.formatMessage({ id: `components.scenarioSelect.caption.${caption}.title` }),
    text: intl.formatMessage({ id: `components.scenarioSelect.caption.${caption}.description` }),
    color: showGraph && SCENARIO_LABEL_COLOR[caption],
  })), [intl, showGraph]);

  const sections = [
    <HintSection title={intl.formatMessage({ id: 'components.scenarioSelect.name' })} section={sectionTitle} />,
    showGraph && <img src={intl.locale === 'fr' ? ScenarioHintImageFr : ScenarioHintImageEn} alt="evolving caption" />,
    <HintSection section={sectionBody} />,
    showGraph && <Divider />,
    showGraph && <HintSection section={sectionCaption} />,
  ].filter(Boolean);
  return <Hint label="scenarios" content={sections} className={classes.scenarios} isTextButton={isTextButton}>{children}</Hint>;
};

HintScenarioSelect.propTypes = { children: PropTypes.node, isTextButton: PropTypes.bool };
HintScenarioSelect.defaultProps = { children: null, isTextButton: false };
