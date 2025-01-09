import { Slide } from '@material-ui/core';
import React from 'react';

function TransitionSlide(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
}

export default React.forwardRef(TransitionSlide);
