import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, InputBase, withStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { debounce } from 'lodash';

const styled = withStyles((theme) => ({
  root: {
    position: 'relative',
    // height: '50px',
    // margin: theme.spacing(5, 0),
    padding: theme.spacing(1, 0),
    backgroundColor: '#f5f5f5',
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  squircle: {
    borderRadius: theme.spacing(3),
  },
  input: {
    position: 'relative',
    // width: '95%',
    height: '100%',
    left: 50,
  },
  searchIcon: {
    width: 30,
    margin: '0 10px',
    position: 'absolute',
    top: '50%',
    left: 0,
    zIndex: 100,
    color: '#ababab',
    transform: 'translateY(-50%)',
  },
  closeIcon: {
    width: 30,
    margin: '0 10px',
    position: 'absolute',
    top: '50%',
    right: 0,
    zIndex: 100,
    color: '#ababab',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
  },
}));

class CommonSearchBar extends Component {
  handleSubmit = debounce((event) => {
    if (typeof this.props.onPropHandleSumbit === 'function') {
      this.props.onPropHandleSumbit();
    }
    event.preventDefault();
  }, 300);
  render() {
    const { classes, view, value, onChange } = this.props;
    const searchBarSquare = (
      <Box borderColor='primary.main' border={1} className={classes.root}>
        <SearchIcon className={classes.searchIcon} />
        <InputBase
          value={value}
          placeholder='Search...'
          inputProps={{ 'aria-label': 'search' }}
          className={classes.input}
          onChange={onChange}
        />
        {value && this.props?.onClose ? (
          <CloseIcon
            onClick={this.props?.onClose}
            className={classes.closeIcon}
          />
        ) : null}
      </Box>
    );
    const searchBarSquircle = (
      <Box className={`${classes.root} ${classes.squircle}`}>
        <SearchIcon className={classes.searchIcon} />
        <InputBase
          value={value}
          placeholder='Search...'
          inputProps={{ 'aria-label': 'search' }}
          className={classes.input}
          onChange={(e) => {
            onChange(e);
            this.handleSubmit(e);
          }}
        />
        {value && this.props?.onClose ? (
          <CloseIcon
            onClick={this.props?.onClose}
            className={classes.closeIcon}
          />
        ) : null}
      </Box>
    );
    return (
      <form onSubmit={this.handleSubmit}>
        {view === 'square' ? searchBarSquare : searchBarSquircle}
      </form>
    );
  }
}

export default styled(CommonSearchBar);

CommonSearchBar.defaultProps = {
  view: 'square',
};

CommonSearchBar.propTypes = {
  view: PropTypes.oneOf(['square', 'squircle']),
  value: PropTypes.string.isRequired,
  onPropHandleSumbit: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};
