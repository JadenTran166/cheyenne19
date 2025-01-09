import React from 'react';
import {
  makeStyles,
  Box,
  InputBase,
  IconButton,
  FormControl,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';

const mateUI = makeStyles((theme) => ({
  researcher: {
    padding: 20,
  },
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    border: '2px solid #E5E5E5',
    borderRadius: '5px',
    padding: '10px 15px 10px 23px',
  },
  squircle: {
    borderRadius: theme.spacing(3),
  },
  input: {
    display: 'flex',
    flexGrow: 8,
    // width: '95%',
    height: '100%',
    backgroundColor: 'white',
    color: '#1B1C1E',
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    left: 0,
    zIndex: 100,
    color: '#ababab',
    transform: 'translateY(-50%)',
  },
  closeIcon: {
    position: 'absolute',
    top: '50%',
    right: 0,
    zIndex: 100,
    color: '#ababab',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
  },
}));

function Researcher(props) {
  const classes = mateUI();
  const { view, value, onChange } = props;

  const handleSubmit = debounce((event) => {
    if (typeof props.sideWanttoBuySearchEnter === 'function') {
      props.sideWanttoBuySearchEnter();
    }
  }, 300);

  const searchBarSquare = (
    <Box borderColor='black' className={classes.root}>
      <InputBase
        onKeyPress={props.onKeyPress}
        value={value}
        placeholder={
          props?.placeHolder || props?.placeholder_value || 'Search...'
        }
        inputProps={{ 'aria-label': 'search' }}
        className={classes.input}
        onSubmit={handleSubmit}
        onChange={onChange}
      />
      {value && props?.onClose ? (
        <CloseIcon onClick={props?.onClose} className={classes.closeIcon} />
      ) : null}

      <IconButton>
        <SearchIcon className={classes.searchIcon} />
      </IconButton>
    </Box>
  );

  const searchBarSquircle = (
    <Box className={`${classes.root} ${classes.squircle}`}>
      <InputBase
        onKeyPress={props.onKeyPress}
        value={value}
        placeholder={
          props?.placeHolder || props?.placeholder_value || 'Search...'
        }
        inputProps={{ 'aria-label': 'search' }}
        className={classes.input}
        onSubmit={handleSubmit}
        onChange={onChange}
      />

      <IconButton>
        <SearchIcon className={classes.searchIcon} />
      </IconButton>

      {value && props?.onClose ? (
        <CloseIcon onClick={props?.onClose} className={classes.closeIcon} />
      ) : null}
    </Box>
  );

  const checkEnter = (e) => {
    const key_code = e.which;
    if (key_code === 13) {
      handleSubmit(e);
    }
  };

  return (
    <div className={classes.researcher}>
      <FormControl onKeyPress={checkEnter} fullWidth={true}>
        {view === 'square' ? searchBarSquare : searchBarSquircle}
      </FormControl>
    </div>
  );
}

Researcher.defaultProps = {
  view: 'square',
};

Researcher.propTypes = {
  view: PropTypes.oneOf(['square', 'squicle']),
  //  value: PropTypes.string.isRequired,
  value: PropTypes.string,

  handleSearchEnter: PropTypes.func,
  //onChange: PropTypes.func.isRequired,
  onChange: PropTypes.func,

  sideWanttoBuySearchEnter: PropTypes.func,
};

export default Researcher;
