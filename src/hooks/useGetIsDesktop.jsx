import { useMediaQuery, useTheme } from '@material-ui/core';

export default () => useMediaQuery(useTheme().breakpoints.up('md'));
