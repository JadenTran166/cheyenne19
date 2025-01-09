import React from 'react';
import { Button, Box, makeStyles, Typography, Avatar } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { ENV_ASSETS_ENDPOINT } from '../../env/local';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 'auto',
    width: '700px',
    position: 'fixed',
    objectFit: 'contain',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    '& .MuiAvatar-img': {
      objectFit: 'contain',
    },
  },
}));

export default function PreviewAvatarModal(props) {
  const classes = useStyles(props);
  const { open, onClose, imgSrc } = props;
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}>
      {/* <div className={classes.avatar}>
          <img src={`${ENV_ASSETS_ENDPOINT}${imgSrc}`}/>
        </div> */}

      <Box>
        <Avatar variant='square' src={imgSrc} className={classes.avatar} />
      </Box>
    </Modal>
  );
}
