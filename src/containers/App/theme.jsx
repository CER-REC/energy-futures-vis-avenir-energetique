import { createMuiTheme } from '@material-ui/core';

/**
 * Customize the look-and-feel of UI components here.
 */
const defaultTheme = createMuiTheme({
  palette: {
    primary: { main: '#4A93C7' },
    secondary: {
      main: '#5D5D5D',
      light: '#83868E',
    },
  },
});
const theme = createMuiTheme({
  palette: {
    primary: { main: defaultTheme.palette.primary.main },
    secondary: {
      main: defaultTheme.palette.secondary.main,
      light: defaultTheme.palette.secondary.light,
    },
  },
  mixins: {
    zoneLabel: {
      fill: defaultTheme.palette.secondary.main,
      fontFamily: defaultTheme.typography.fontFamily,
      fontSize: 13,
      textTransform: 'uppercase',
    },
    chart: {
      height: 700,
    },
    contextButton: {
      height: 'auto',
      minHeight: 30,
      width: 100,
      padding: defaultTheme.spacing(0.25, 1),
      border: '1px solid transparent',
      fontSize: 13,
      letterSpacing: -0.25,
      textAlign: 'left',
      textTransform: 'initial',
      justifyContent: 'left',
    },
    contextAccent: {
      borderLeftWidth: 8,
      borderLeftStyle: 'solid',
      borderLeftColor: defaultTheme.palette.primary.main,
    },
    selectBorder: {
      border: '1px solid #A6A6A6',
    },
    selectionContainer: {
      width: 'auto',
      margin: defaultTheme.spacing(0.5, 3, 0.5, 1),
    },
    labelContainer: {
      '&:first-child:not(override)': {
        paddingRight: 0,
      },
    },
  },
  typography: {
    fontFamily: '"FiraSansCondensed", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  overrides: {
    MuiTypography: {
      h4: { fontSize: 34 },
      h5: { fontSize: 22 },
      h6: {
        fontSize: 20,
        fontWeight: 700,
      },
      body1: { fontSize: 16 },
      body2: { fontSize: 14 },
      caption: {
        fontSize: 12,
        lineHeight: 1.3,
        '& > p': { margin: 0 },
      },
      overline: { fontSize: 12 },
      subtitle1: {
        fontSize: 16,
        color: defaultTheme.palette.secondary.main,
        fontWeight: 700,
      },
    },
    MuiButton: {
      root: {
        height: 23,
        minWidth: 60,
        borderRadius: 0,
        fontSize: 14,
      },
      label: { margin: 'auto' },
      containedPrimary: {
        fontWeight: 700,
        color: defaultTheme.palette.common.white,
        backgroundColor: defaultTheme.palette.primary.main,
        border: `1px solid ${defaultTheme.palette.primary.main}`,
        boxShadow: defaultTheme.shadows[0],
        '&:hover': {
          border: '1px solid #33668b',
        },
      },
      containedSecondary: {
        minWidth: 0,
        color: defaultTheme.palette.secondary.light,
        backgroundColor: '#F3EFEF',
        boxShadow: defaultTheme.shadows[0],
        '&:hover': {
          backgroundColor: '#F3EFEF',
          boxShadow: defaultTheme.shadows[2],
        },
      },
      containedSizeSmall: {
        fontSize: 13,
        padding: '0 1.5em',
        textTransform: 'unset',
      },
      outlinedPrimary: {
        fontWeight: 500,
        color: defaultTheme.palette.secondary.light,
        backgroundColor: defaultTheme.palette.common.white,
        border: `1px solid ${defaultTheme.palette.secondary.light}`,
        boxShadow: defaultTheme.shadows[0],
        '&:hover': {
          color: defaultTheme.palette.secondary.main,
          border: `1px solid ${defaultTheme.palette.secondary.main}`,
          boxShadow: defaultTheme.shadows[2],
        },
      },
      outlinedSizeSmall: {
        fontSize: 13,
        padding: '0 1.5em',
        textTransform: 'unset',
      },
      textPrimary: {
        minWidth: 'unset',
        padding: 0,
        textAlign: 'left',
        fontWeight: 'bold',
        textTransform: 'inherit',
        '&:hover': {
          backgroundColor: 'inherit',
          textDecoration: 'underline',
        },
        '&$focusVisible': {
          backgroundColor: defaultTheme.palette.action.focus,
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: defaultTheme.palette.common.white,
        color: defaultTheme.palette.secondary.main,
        fontSize: 12,
        border: `1px solid ${defaultTheme.palette.secondary.main}`,
        boxShadow: defaultTheme.shadows[1],
        borderRadius: 0,
      },
    },
    MuiDialog: {
      root: {
        fontFamily: '"FiraSansCondensed", "Roboto", "Helvetica", "Arial", sans-serif',
        '& button': { height: 'auto' },
      },
    },
    MuiSvgIcon: {
      root: { fontSize: 24 },
      fontSizeSmall: { fontSize: 20 },
      fontSizeLarge: { fontSize: 35 },
    },
    MuiTableCell: {
      root: {
        fontSize: 12,
        borderBottom: 'none',
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 992,
      lg: 1280,
      xl: 2600,
    },
  },
});

export default theme;
