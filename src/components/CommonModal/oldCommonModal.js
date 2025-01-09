import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import { makeStyles, Zoom } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const useStyle = makeStyles((theme) => {
  return {
    dialogPaper: {
      overflow: 'unset',
    },
  };
});

export default function OldCommonModal(props) {
  const classes = useStyle();
  //   const [open, setOpen] = React.useState(false);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  return (
    <Dialog
      open={props.isOpen}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{ className: classes.dialogPaper }}
      onClose={props.handleClose}
      maxWidth={props.maxWidth}
      fullWidth={props.fullWidth}>
      {props.children}
    </Dialog>
  );
}

OldCommonModal.defaultProps = {
  fullWidth: true,
};
