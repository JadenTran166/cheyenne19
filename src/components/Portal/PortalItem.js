import React from 'react';
import { makeStyles, Typography, Box, Paper } from '@material-ui/core';
import defaultImg from '../../assets/img/default_img.png';
import { ASSETS_ENDPOINT } from '../../constants/common';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(2),
    cursor: 'pointer',
    boxShadow: theme.shadows[1],
    '&:hover': {
      boxShadow: theme.shadows[3],
    },
  },
  img: {
    backgroundImage: (props) =>
      props.src ? `url(${ASSETS_ENDPOINT + props.src})` : `url(${defaultImg})`,
    width: '100%',
    backgroundPosition: 'center',
    height: '200px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto',
  },
}));
export default function PortalItem(props) {
  const classes = useStyles(props);
  return (
    <Paper className={classes.root} onClick={props.onClick}>
      <Box>
        <div className={classes.img}></div>
      </Box>
      <Typography variant='subtitle1' color='primary'>
        <Box textAlign='center' fontWeight='600'>
          {props.children}
        </Box>
      </Typography>
    </Paper>
  );
}
