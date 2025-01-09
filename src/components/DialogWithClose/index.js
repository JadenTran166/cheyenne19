import { Dialog, IconButton, makeStyles } from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import cn from 'classnames';
import { CloseOutlined, CloseRounded } from '@material-ui/icons';
const useStyles = makeStyles((theme) => ({
  ctnDialog: {
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
  },
}));

export default function DialogWithClose({ isOpen, ...props }) {
  const classes = useStyles();
  return (
    <Dialog
      {...props}
      open={isOpen}
      className={cn({
        [classes.ctnDialog]: true,
        [props.className]: !!props.className,
      })}>
      <IconButton
        className={classes.closeBtn}
        aria-label='close-modal'
        onClick={props.onClose}
        color='primary'
        size='medium'>
        {/* <CloseIcon /> */}
        <CloseRounded color='primary' />
      </IconButton>
      <div>{props.children}</div>
    </Dialog>
  );
}
