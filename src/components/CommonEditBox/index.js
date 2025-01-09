import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { Paper, makeStyles, IconButton, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-block',
    backgroundColor: 'transparent',
    position: 'relative',
    width: props => props.width,
  },
  editIcon: {
    position: 'absolute',
    zIndex: 1000,
  },
}));

export default function CommonEditBox(props) {
  const classes = useStyles(props);
  const theme = useTheme();
  const { children, spacing, isIn, sizeBtn, onClick } = props;
  const sizeIcon = sizeBtn === 'small' ? 24 : 48;
  const _spacing = isIn
    ? theme.spacing(spacing)
    : -(theme.spacing(spacing) + sizeIcon);

  const data = {
    left: {
      left: _spacing,
      bottom: 0,
    },
    right: {
      right: _spacing,
      bottom: 0,
    },
    top: {
      top: _spacing,
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      bottom: _spacing,
      left: '50%',
      transform: 'translateX(-50%)',
    },
    'bottom-left': {
      bottom: _spacing,
      left: _spacing,
    },
    'bottom-right': {
      bottom: _spacing,
      right: _spacing,
    },
    'top-left': {
      top: _spacing,
      left: _spacing,
    },
    'top-right': {
      top: _spacing,
      right: _spacing,
    },
  };

  return (
    <Paper elevation={0} className={classes.root}>
      {children}
      <IconButton
        size={sizeBtn}
        className={classes.editIcon}
        style={{ ...data[`${props.position}`] }}
        onClick={() => {
          if (typeof onClick === 'function') {
            onClick();
          }
        }}>
        <EditIcon color='secondary' fontSize='inherit' />
      </IconButton>
    </Paper>
  );
}

CommonEditBox.propTypes = {
  position: PropTypes.oneOf([
    'top',
    'bottom',
    'left',
    'right',
    'bottom-left',
    'bottom-right',
    'top-left',
    'top-right',
  ]),
  spacing: PropTypes.number,
  isIn: PropTypes.bool,
  sizeBtn: PropTypes.oneOf(['small', 'medium']),
  onClick: PropTypes.func,
  width: PropTypes.string,
};
CommonEditBox.defaultProps = {
  position: 'right',
  spacing: 0,
  isIn: false,
  sizeBtn: 'small',
  width: '',
};
