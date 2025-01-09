import React from 'react';
import { makeStyles, Box, Chip, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {},
  chip: {
    backgroundColor: ({ bgColor }) => bgColor,
    color: ({ bgColor }) => theme.palette.getContrastText(bgColor),
    padding: theme.spacing(1, 2),
    borderRadius: '999px',
  },
}));

export default function CommonChip(props) {
  const classes = useStyles(props);
  return (
    <Box component='span' fontWeight='600' className={classes.chip}>
      {props.label}
    </Box>
  );
}

CommonChip.propTypes = {
  bgColor: PropTypes.string,
  label: PropTypes.string.isRequired,
};
CommonChip.defaultProps = {
  bgColor: '#000',
};
