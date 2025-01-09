import { Box, Grid, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

function CommonLayout(props) {
  return (
    <Grid container spacing={2}>
      {props.leftComponent && (
        <Grid item xs={12} md={3}>
          <Paper elevation={0}>
            <Box>{props.leftComponent}</Box>
          </Paper>
        </Grid>
      )}
      <Grid item xs={12} md={props.leftComponent ? 9 : 12}>
        <Paper elevation={0}>
          <Box>{props.rightComponent}</Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

CommonLayout.propTypes = {
  leftComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  rightComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};

export default CommonLayout;
