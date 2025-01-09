import React, { useState, useRef, useEffect } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

const data = {
  sm: {
    width: '110px',
    height: '30px',
    characterSize: 8,
  },
  md: {
    width: '130px',
    height: '40px',
    fontSize: '20px',
    characterSize: 12,
  },
  lg: {
    width: '170px',
    height: '50px',
    fontSize: '22px',
    characterSize: 16,
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    border: '1px solid rgba(0,0,0,0.16)',
    display: 'inline-flex',
    justifyContent: 'center',
    height: (props) => data[props.size].height,
    '& input': {
      fontSize: (props) => data[props.size].fontSize,
      border: '1px solid rgba(0,0,0,0.16)',
      height: '100%',
      outline: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      textAlign: 'center',
      minWidth: (props) => data[props.size].height,
      maxWidth: (props) => data[props.size].height,
      padding: theme.spacing(0, 0.5),
      transition: '0.1s width',
    },
  },
  btn: {
    // minWidth: 'auto',
    minWidth: (props) => data[props.size].height,
    maxWidth: (props) => data[props.size].height,
  },
}));
export default function CommonQuantityControl(props) {
  const [count, setCount] = useState(() =>
    props.value < props.minValue ? props.minValue : props.value
  );
  const [widthInput, setWidthInput] = useState(null);
  const textInput = useRef(null);
  const classes = useStyles(props);
  const onHandleChange = (e) => {
    const value = Number(e.target.value);

    if (isNaN(value) || value > 999999999999) {
      return;
    }
    setCount(value);
  };

  const onHandleIncrease = () => {
    setCount(count + 1);
  };
  const onHandleDecrease = () => {
    if (count > props.minValue) {
      setCount(count - 1);
    }
  };
  const validateInput = (e) => {
    const value = Number(e.target.value);
    if (value < props.minValue) {
      setCount(props.minValue);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const value = textInput.current.value;
      if (value.length < 3) {
        setWidthInput(null);
        return;
      }
      setWidthInput((value.length + 2) * data[props.size].characterSize + 'px');
    };

    handleResize();
    if (typeof props.getValue === 'function') {
      props.getValue(count);
    }
  }, [count]);

  return (
    <div className={classes.root}>
      <Button
        aria-label='decrease'
        className={classes.btn}
        fullWidth
        disabled={props.disabled}
        onClick={onHandleDecrease}>
        <RemoveIcon fontSize='small' />
      </Button>
      <input
        type='text'
        value={count}
        onChange={onHandleChange}
        disabled={props.disabled}
        onBlur={validateInput}
        style={{ maxWidth: `${widthInput ? widthInput : ''}` }}
        ref={textInput}
      />
      <Button
        aria-label='increase'
        className={classes.btn}
        fullWidth
        disabled={props.disabled}
        onClick={onHandleIncrease}>
        <AddIcon fontSize='small' />
      </Button>
    </div>
  );
}

CommonQuantityControl.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  minValue: PropTypes.number,
  getValue: PropTypes.func,
};

CommonQuantityControl.defaultProps = {
  size: 'sm',
  minValue: 1,
  value: 1,
  getValue: null,
};
