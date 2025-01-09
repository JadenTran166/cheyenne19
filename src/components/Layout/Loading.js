import React from 'react';
const { Box, CircularProgress } = require('@material-ui/core');
export default function Loading(props) {
  return (
    <Box
      width='100%'
      display='flex'
      justifyContent='center'
      alignItems='center'>
      <CircularProgress
        size={props.size || 40}
        color={props.color || 'primary'}
      />
    </Box>
  );
}
