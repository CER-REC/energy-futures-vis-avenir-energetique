import {makeStyles, Typography} from "@material-ui/core";
import React from "react";
import Markdown from "react-markdown";

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const NoDataMessage = ({ message }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography><Markdown>{message}</Markdown></Typography>
    </div>
  )
}

export default NoDataMessage;
