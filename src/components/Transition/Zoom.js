import { Zoom } from '@material-ui/core';
import React from 'react';

function TransitionZoom(props, ref) {
  return <Zoom ref={ref} {...props} />;
}

export default React.forwardRef(TransitionZoom);
