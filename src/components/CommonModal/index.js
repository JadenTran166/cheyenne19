import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import { IconButton, makeStyles, Zoom } from '@material-ui/core';
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function CommonModal(props) {
  const classes = useStyle(props);

  const iconSize = props.size || 'small';

  return (
    <Dialog
      className={classes.root}
      open={props.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.handleClose}
      maxWidth={props.maxWidth}
      fullWidth={props.fullWidth}>
      {props.children}
      <IconButton
        className={classes.iconClose}
        aria-label='close'
        onClick={props.handleClose}
        size={props.size || 'small'}>
        {props.isCloseBtn && <CloseIcon fontSize={props.size || 'small'} />}
      </IconButton>
    </Dialog>
  );
}

CommonModal.defaultProps = {
  fullWidth: true,
};
