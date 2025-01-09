import React from 'react';
const { Box, CircularProgress, makeStyles } = require('@material-ui/core');
const useStyles = makeStyles((theme, props) => ({
  root: {
    position: 'relative',
    zIndex: 1000,
  },
  overlayLoading: {
    backgroundColor: (props) => {
      if (props.isLight) {
        return props.opacity
          ? `rgba(255,255,255,${props.opacity})`
          : 'rgba(255,255,255,0.5)';
      } else {
        return props.opacity
          ? `rgba(0,0,0,${props.opacity})`
          : 'rgba(0,0,0,0.5)';
      }
    },
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  loading: {
    // position: 'absolute',
  },
}));
export default function OverlayLoading(props) {
  const classes = useStyles(props);
  return (
    <div
      className={classes.root}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      {props.children}
      {props.isLoading && (
        <Box
          className={classes.overlayLoading}
          width='100%'
          height='100%'
          display='inline-flex'
          justifyContent='center'
          alignItems='center'>
          <CircularProgress
            // className={classes.loading}
            size={props.size || 40}
            color={props.color || 'primary'}
          />
        </Box>
      )}
    </div>
  );
}
