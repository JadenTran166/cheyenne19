import React from 'react';
import { makeStyles, Typography, Box } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
  },
  lineLeft: {
    position: 'relative',
    '&::after': {
      content: "' '",
      width: '50%',
      height: '6%',
      background: theme.palette.primary.main,
      position: 'absolute',
      right: '0.5rem',
      top: '47%',
    },
  },
  lineRight: {
    position: 'relative',

    '&::after': {
      content: "' '",
      width: '50%',
      height: '6%',
      background: theme.palette.primary.main,
      position: 'absolute',
      left: '0.5rem',
      top: '47%',
    },
  },
}));
export default function CustomTitle(props) {
  const classes = useStyles();
  return (
    <Typography variant='h5' color='primary'>
      <Box textAlign='center' className={classes.title}>
        <Box flex='1' className={classes.lineLeft}></Box>
        <Box>{props.children}</Box>
        <Box flex='1' className={classes.lineRight}></Box>
      </Box>
    </Typography>
  );
}
