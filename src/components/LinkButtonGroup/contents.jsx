import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import Markdown from 'react-markdown';
import ReportLinkImage from './report-link.png';

export const LinkButtonContentAssumptions = ({ yearId }) => {
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
      <Typography variant="body2" color="secondary" component="span" gutterBottom><Markdown>{text}</Markdown></Typography>
      <Typography variant="body2" color="secondary" component="span"><Markdown>{link}</Markdown></Typography>
    </>
  );
};
LinkButtonContentAssumptions.propTypes = { yearId: PropTypes.string.isRequired };

export const LinkButtonContentKeyFindings = ({ yearId }) => {
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
      <Typography variant="body2" color="secondary" component="span" gutterBottom><Markdown>{text}</Markdown></Typography>
      <Typography variant="body2" color="secondary" component="span"><Markdown>{link}</Markdown></Typography>
    </>
  );
};
LinkButtonContentKeyFindings.propTypes = { yearId: PropTypes.string.isRequired };

export const LinkButtonContentResults = ({ yearId }) => {
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
      <Typography variant="body2" color="secondary" component="span" gutterBottom><Markdown>{text}</Markdown></Typography>
      <Typography variant="body2" color="secondary" component="span"><Markdown>{link}</Markdown></Typography>
    </>
  );
};
LinkButtonContentResults.propTypes = { yearId: PropTypes.string.isRequired };

export const LinkButtonContentReport = () => {
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({ id: 'links.Report.description' }), [intl]);
  const link = useMemo(() => intl.formatMessage({ id: 'links.Report.link' }), [intl]);
  return (
    <>
      <Typography variant="body2" color="secondary" gutterBottom>{text}</Typography>
      <Grid container alignItems="flex-end" wrap="nowrap" spacing={1}>
        <Grid item xs={5}><img src={ReportLinkImage} alt="report link" /></Grid>
        <Grid item xs={7}><Typography variant="body2" color="secondary" component="span"><Markdown>{link}</Markdown></Typography></Grid>
      </Grid>
    </>
  );
};

export const LinkButtonContentMethodology = () => {
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({ id: 'links.Methodology.description' }), [intl]);
  return <Typography variant="body2" color="secondary" component="span"><Markdown>{text}</Markdown></Typography>;
};

export const LinkButtonContentAbout = () => {
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({ id: 'about' }), [intl]);
  return <Typography variant="body2" color="secondary" component="span"><Markdown>{text}</Markdown></Typography>;
};
