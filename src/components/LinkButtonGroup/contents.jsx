import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { makeStyles, Grid, Typography, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Markdown from 'react-markdown';
import useConfig from '../../hooks/useConfig';
import analytics from '../../analytics';
import reportCoverEn from '../../pages/Landing/report_cover_en.png';
import reportCoverFr from '../../pages/Landing/report_cover_fr.png';

const LinkButtonContentAssumptions = ({ yearId }) => {
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({
    id: `links.Assumptions.description.${yearId}`,
    defaultMessage: intl.formatMessage({ id: 'links.Assumptions.description.default' }),
  }), [intl, yearId]);
  const link = useMemo(() => intl.formatMessage({
    id: `links.Assumptions.link.${yearId}`,
    defaultMessage: intl.formatMessage({ id: 'links.Assumptions.link.default' }),
  }), [intl, yearId]);
  return (
    <>
      <Typography variant="body2" color="secondary" component="div" gutterBottom><Markdown>{text}</Markdown></Typography>
      <Typography variant="body2" color="secondary" component="div" gutterBottom><Markdown>{link}</Markdown></Typography>
    </>
  );
};
LinkButtonContentAssumptions.propTypes = { yearId: PropTypes.string.isRequired };

const LinkButtonContentKeyFindings = ({ yearId }) => {
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({
    id: `links.Findings.description.${yearId}`,
    defaultMessage: intl.formatMessage({ id: 'links.Findings.description.default' }),
  }), [intl, yearId]);
  const link = useMemo(() => intl.formatMessage({
    id: `links.Findings.link.${yearId}`,
    defaultMessage: intl.formatMessage({ id: 'links.Findings.link.default' }),
  }), [intl, yearId]);
  return (
    <>
      <Typography variant="body2" color="secondary" component="div" gutterBottom><Markdown>{text}</Markdown></Typography>
      <Typography variant="body2" color="secondary" component="div" gutterBottom><Markdown>{link}</Markdown></Typography>
    </>
  );
};
LinkButtonContentKeyFindings.propTypes = { yearId: PropTypes.string.isRequired };

const LinkButtonContentResults = ({ yearId }) => {
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({
    id: `links.Results.description.${yearId}`,
    defaultMessage: intl.formatMessage({ id: 'links.Results.description.default' }),
  }), [intl, yearId]);
  const link = useMemo(() => intl.formatMessage({
    id: `links.Results.link.${yearId}`,
    defaultMessage: intl.formatMessage({ id: 'links.Results.link.default' }),
  }), [intl, yearId]);
  return (
    <>
      <Typography variant="body2" color="secondary" component="div" gutterBottom><Markdown>{text}</Markdown></Typography>
      <Typography variant="body2" color="secondary" component="div" gutterBottom><Markdown>{link}</Markdown></Typography>
    </>
  );
};
LinkButtonContentResults.propTypes = { yearId: PropTypes.string.isRequired };

const LinkButtonContentSummary = ({ yearId }) => {
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({ id: `components.yearSelect.${yearId}.description` }), [intl, yearId]);
  const src = useMemo(() => (yearId === '2020' // eslint-disable-line no-nested-ternary
    ? (intl.locale === 'fr' ? reportCoverFr : reportCoverEn)
    : intl.formatMessage({ id: `links.Summary.image.${yearId}` })), [intl, yearId]);
  const link = useMemo(() => intl.formatMessage({
    id: `links.Summary.link.${yearId}`,
    defaultMessage: intl.formatMessage({ id: 'links.Summary.link.default' }),
  }), [intl, yearId]);
  return (
    <>
      <Typography variant="body2" color="secondary" style={{ marginBottom: 24 }}>{text}</Typography>
      <Grid container alignItems="flex-end" wrap="nowrap" spacing={1}>
        <Grid item xs={5}>
          <img src={src} alt={intl.formatMessage({ id: 'common.a11y.downloadReport' })} />
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body2" color="secondary" component="span"><Markdown>{link}</Markdown></Typography>
        </Grid>
      </Grid>
    </>
  );
};
LinkButtonContentSummary.propTypes = { yearId: PropTypes.string.isRequired };

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(1, 1.5, 2, 1.5),
  },
  header: {
    position: 'sticky',
    top: 0,
    minHeight: 28,
    width: '100%',
    backgroundColor: '#F3EFEF',
    textAlign: 'right',
  },
  tab: {
    height: 'auto',
    whiteSpace: 'nowrap',
    borderRight: `1px solid ${theme.palette.secondary.light}`,
    borderBottom: `1px solid ${theme.palette.secondary.light}`,
    textTransform: 'none',
    color: theme.palette.secondary.main,
    'button[disabled]&': { color: theme.palette.secondary.main },
  },
  selected: {
    borderBottom: 'none',
    cursor: 'default',
  },
  close: {
    height: 'auto',
    minWidth: 36,
    borderRight: 'none',
  },
  reportContent: {
    height: 280,
    overflowX: 'hidden',
  },
}));

export const LinkButtonContentMethodology = ({ onClose }) => {
  const classes = useStyles();
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({ id: 'links.Methodology.description' }), [intl]);
  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid item className={classes.header}>
        <Button aria-label={intl.formatMessage({ id: 'common.a11y.close' })} onClick={onClose} className={classes.close}>
          <CloseIcon />
        </Button>
      </Grid>
      <Grid item className={classes.content}><Markdown>{text}</Markdown></Grid>
    </Grid>
  );
};
LinkButtonContentMethodology.propTypes = { onClose: PropTypes.func.isRequired };

export const LinkButtonContentAbout = ({ onClose }) => {
  const classes = useStyles();
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({ id: 'about' }), [intl]);
  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid item className={classes.header}>
        <Button aria-label={intl.formatMessage({ id: 'common.a11y.close' })} onClick={onClose} className={classes.close}>
          <CloseIcon />
        </Button>
      </Grid>
      <Grid item className={classes.content}><Markdown>{text}</Markdown></Grid>
    </Grid>
  );
};
LinkButtonContentAbout.propTypes = { onClose: PropTypes.func.isRequired };

export const LinkButtonContentReport = ({ yearId, onClose }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { config: { page } } = useConfig();

  const tabs = useMemo(() => [
    { tag: 'summary', title: intl.formatMessage({ id: 'links.Summary.title' }), content: <LinkButtonContentSummary yearId={yearId} /> },
    { tag: 'key findings', title: intl.formatMessage({ id: 'links.Findings.title' }), content: <LinkButtonContentKeyFindings yearId={yearId} /> },
    { tag: 'assumptions', title: intl.formatMessage({ id: 'links.Assumptions.title' }), content: <LinkButtonContentAssumptions yearId={yearId} /> },
    { tag: 'results', title: intl.formatMessage({ id: 'links.Results.title' }), content: <LinkButtonContentResults yearId={yearId} /> },
  ], [intl, yearId]);
  const [select, setSelect] = useState(tabs[0]);

  const onTabClick = (tab) => {
    setSelect(tab);
    analytics.reportMisc(page, 'click', tab.tag);
  };

  return (
    <>
      <Grid container alignItems="center" wrap="nowrap" className={classes.header}>
        {tabs.map(tab => (
          <Grid item key={`report-button-tab-${tab.title}`}>
            <Button
              disabled={tab.title === select?.title}
              onClick={() => onTabClick(tab)}
              className={`${classes.tab} ${tab.title === select?.title ? classes.selected : ''}`.trim()}
            >
              {tab.title}
            </Button>
          </Grid>
        ))}
        <Grid item>
          <Button aria-label={intl.formatMessage({ id: 'common.a11y.close' })} onClick={onClose} className={`${classes.tab} ${classes.close}`}>
            <CloseIcon />
          </Button>
        </Grid>
      </Grid>
      <Grid item className={`${classes.content} ${classes.reportContent}`}>{(select || {}).content}</Grid>
    </>
  );
};

LinkButtonContentReport.propTypes = {
  yearId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
