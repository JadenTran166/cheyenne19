import { Box, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => {
  return {
    roundedBox: {
      position: 'relative',
      borderRadius: '5px',
      border: (props) => `3px solid ${props.color ? props.color : '#5DA06F'}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '110px',
      '& h6': {
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        background: 'white',
        padding: '0px 20px',
      },
    },
  };
});

export default function RectangleBox(props) {
  // const currentRole = useRole();
  const { title, content } = props;
  const classes = useStyles(props);

  return (
    <Box className={classes.roundedBox}>
      <Typography variant='h6'>{title}</Typography>
      <Typography variant='h5'>{content}</Typography>
    </Box>
  );
}
