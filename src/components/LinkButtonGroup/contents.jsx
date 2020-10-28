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
  return <Typography variant="body2" color="secondary" component="span"><Markdown>{text}</Markdown></Typography>;
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
        <Grid item xs={7}><Typography variant="body2" color="secondary">{link}</Typography></Grid>
      </Grid>
    </>
  );
};

export const LinkButtonContentMethodology = () => {
  const intl = useIntl();
  const text = useMemo(() => intl.formatMessage({ id: 'links.Methodology.description' }), [intl]);
  return <Typography variant="body2" color="secondary" component="span"><Markdown>{text}</Markdown></Typography>;
};

export const LinkButtonContentAbout = () => (
  <>
    <Typography variant="h6" color="secondary" gutterBottom><b>ABOUT THIS PROJECT</b></Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      Exploring Canada’s Energy Future interactive online tool is based on the
      Canada Energy Regulator’s (CER) flagship publication –
      <a href="https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/" target="_blank" rel="noopener noreferrer">Canada’s Energy Future</a>.
      This visualization allows you to explore energy production and consumption trends
      and forecast them into the future. You can explore the data from the most recent
      report, or refer to previous reports.
    </Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      <strong>Background:</strong> Exploring Canada’s Energy Future was initially created
      in 2016 as a pilot project that launched the CER’s Data Visualization Initiative (DVI).
      DVI was a three-year initiative to transform how the CER structures and shares data.
      The objective was to enable evidence-based decision making and remove barriers to
      understanding Canada’s energy and pipeline systems through the use of user-friendly
      interactive visualizations.
    </Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      If you want to use the data for research and undertake your own review, all the data is
      downloadable and shareable. If you are interested in the source code for the visualizations,
      it is available on the government’s Open Government portal:
      <a href="https://open.canada.ca" target="_blank" rel="noopener noreferrer">open.canada.ca</a>.
    </Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      We hope we are hitting the mark. Your feedback is essential.
    </Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      Email us with your comments and ideas: <a href="mailto:data.donnees@cer-rec.gc.ca">data.donnees@cer-rec.gc.ca</a>.
      We look forward to hearing from you.
    </Typography>

    <Typography variant="h6" color="secondary" gutterBottom><b>CONTRIBUTORS</b></Typography>
    <Typography variant="body1" color="secondary" gutterBottom><b>VERSION 2</b></Typography>
    <Typography variant="body1" color="secondary" gutterBottom><b>DATA SOURCE:</b></Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      Matthew Hansen (Market Analyst), Aaron Hoyle (Market Analyst), Mantaj Hundal (Market Analyst),
      Michael Nadew (Market Analyst), Melanie Stogran (Supply Analyst), Bryce van Sluys (Director)
    </Typography>
    <Typography variant="body1" color="secondary" gutterBottom><b>COORDINATION:</b></Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      Amanda Harwood (Project Manager); Romina Imani (Digital Data Coordinator);
      Karen Ryhorchuk (Communications Officer)
    </Typography>
    <Typography variant="body1" color="secondary" gutterBottom><b>DATA VISUALIZATION:</b></Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      Technical Design Lead: Jagoda Walny-Nix<br />
      Design Lead: Doris Kosminsky<br />
      UX Design: Angelsea Saby, Lien Quach<br />
      Design &amp; Production Graphics: Tétro<br />
      Technical Development Lead: VizworX<br />
      Development: Alan Chen, Nico Li, Steven Rothenburger
    </Typography>

    <Typography variant="h6" color="secondary" gutterBottom><b>VERSION 1</b></Typography>
    <Typography variant="body1" color="secondary" gutterBottom><b>DATA SOURCE:</b></Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      Abha Bhargava (Director), Matthew Hansen (Market Analyst), Bryce van Sluys (Market Analyst),
      Chris Doleman (Market Analyst), Michael Nadew (Market Analyst), Lukas Hansen (Market Analyst),
      Mantaj Hundal (Market Analyst), Ryan Safton (Market Analyst)
    </Typography>
    <Typography variant="body1" color="secondary" gutterBottom><b>COORDINATION:</b></Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      Annette Hester (Concept and Coordination); Katherine Murphy (Project Manager); Amanda Harwood
      (Project Manager); Faiza Hussain (Administrative support); Stephen Chow (Data Coordination);
      Garth Rowe (Web Lead); Jim Chisholm (Information Management and Technology)
    </Typography>
    <Typography variant="body1" color="secondary" gutterBottom><b>DATA VISUALIZATION:</b></Typography>
    <Typography variant="body2" color="secondary" gutterBottom>
      Lead Design Research: Sheelagh Carpendale and Wesley Willett, iLab,
      University of Calgary.<br />
      Design: Lindsay MacDonald, Charles Perin, Jo Vermeulen, Doris Kosminsky, Søren Knudsen,
      Lien Quach, Peter Buk, Shreya Chopra, Katrina Tabuli and Claudia Maurer<br />
      Lead Technical: VizworX<br />
      Technical: Stephanie Sachrajda, Patrick King, Alaa Azazi, Abhishek Sharma,
      Ben Cousins and Claudio Esperança
    </Typography>

    <Typography variant="h5" color="secondary" gutterBottom><b>THIRD PARTY LICENSES</b></Typography>
    <Typography variant="body2" color="secondary">
      Map showing provinces and territories reporting 2009 swine flu (H1N1) cases in Canada by
      Fonadier is licensed under CC BY 3.0 / Re-colored and rotated from original.
    </Typography>
  </>
);
