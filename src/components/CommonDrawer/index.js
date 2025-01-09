import React from 'react';
import { Drawer, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
const useStyle = makeStyles((theme) => ({
  root: {
    '& .MuiDrawer-paperAnchorBottom': {
      height: '100%',
    },

    '& .MuiDrawer-paper ': {
      paddingTop: (props) =>
        props.isCloseBtn ? theme.spacing(7) : theme.spacing(0),
    },
  },
  iconClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 50,
  },
}));

export default function CommonDrawer(props) {
  const classes = useStyle(props);
  return (
    <Drawer
      className={classes.root}
      keepMounted
      anchor={props.anchor || 'right'}
      open={props.isOpen}
      onClose={props.handleClose}>
      {props.children}
      <IconButton
        className={classes.iconClose}
        aria-label='close'
        onClick={props.handleClose}>
        {props.isCloseBtn && <CloseIcon />}
      </IconButton>
    </Drawer>
  );
}
