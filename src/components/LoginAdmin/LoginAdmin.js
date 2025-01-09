import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Box,
  Button,
  TextField,
  FormControl,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import validator from 'validator';

import { AlertModal } from './../AlertModal/AlertModal';
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginForm: {
    height: '400px',
    width: '60%',
    padding: '0 85px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 5,
    [theme.breakpoints.between('xs', 'sm')]: {
      width: '100%',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '70%',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: '60%',
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      width: '60%',
    },
  },
  formHead: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%',
    height: '15%',
    '& h3': {
      margin: 0,
    },
  },
  formMain: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    width: '100%',
    height: '55%',
  },
  formFoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',

    height: '30%',
    width: '100%',
  },
  btnLogin: {
    height: 53,
    width: '70%',
    borderRadius: 5,
    textTransform: 'initial',
    fontWeight: 'initial',
    backgroundColor: '#1c523c',
  },
  link: {
    color: '#1c523c',
    padding: '20px 0',
  },
}));

const LoginAdmin = (props) => {
  const classes = useStyles();
  const [maileOrPhone, setMaileOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState({
    status: false,
    content: '',
  });
  const handleMaileOrPhoneChange = (e) => {
    const vl = e.target.value;
    if (validator.isEmail(vl) || validator.isMobilePhone(vl, 'any')) {
      setError(false);
      setMaileOrPhone(vl);
    } else {
      setError(true);
    }
  };
  const handlePasswordChange = (e) => {
    const vl = e.target.value;
    setPassword(vl);
    if (vl.length <= 0) {
      setError(true);

      setPasswordError({
        status: true,
        content: 'Mật khẩu không được bỏ trống!',
      });
    } else if (vl.length < 4) {
      setError(true);
      setPasswordError({
        status: true,
        content: 'Mật khẩu phải lớn hơn hoặc bằng 4 ký tự!',
      });
    } else {
      setError(false);

      setPasswordError({
        status: false,
        content: '',
      });
    }
  };

  const [disable_btn, setDisableBtn] = useState(false);

  const handleLogin = () => {
    setDisableBtn(true);
    if (!error && maileOrPhone !== '' && password !== '') {
      if (typeof props.handleLogin === 'function') {
        props.handleLogin(maileOrPhone, password, setDisableBtn);
      }
    } else if (maileOrPhone.trim() === '' || password.trim() === '') {
      const messageTrigger = {
        title: 'Bạn nhập sai thông tin!',
        icon: 'error',
        timer: 2000,
        description: '',
      };
      AlertModal(messageTrigger);
      setDisableBtn(false);
    } else {
      const messageTrigger = {
        title: 'Bạn nhập sai thông tin!',
        icon: 'error',
        timer: 2000,
        description: '',
      };
      AlertModal(messageTrigger);
      setDisableBtn(false);
    }
  };

  const checkEnter = (e) => {
    const k_code = e.which;
    if (k_code === 13) {
      handleLogin();
    }
  };

  return (
    <Grid container className={classes.root}>
      <Box className={classes.loginForm}>
        <Box className={classes.formHead}>
          <h3>Đăng nhập</h3>
        </Box>
        <Box className={classes.formMain}>
          <FormControl fullWidth={true}>
            <TextField
              error={error}
              helperText={
                error ? 'Hãy nhập email hoặc số điện thoại của bạn' : ''
              }
              onKeyPress={checkEnter}
              onChange={handleMaileOrPhoneChange}
              label='Email&nbsp;/&nbsp;Số điện thoại'
              variant='outlined'
            />
          </FormControl>

          <FormControl fullWidth={true}>
            <TextField
              fullWidth={true}
              onKeyPress={checkEnter}
              onChange={handlePasswordChange}
              error={passwordError.status}
              helperText={passwordError ? passwordError.content : ''}
              label='Mật khẩu'
              variant='outlined'
              type='password'
            />
          </FormControl>
        </Box>
        <Box className={classes.formFoot}>
          <Button
            disabled={disable_btn ? true : false}
            className={classes.btnLogin}
            variant='contained'
            onClick={handleLogin}
            color='primary'>
            Đăng nhập
          </Button>

          <a href='http://cheyenne19.com/' className={classes.link}>
            Về Cheyenne19
          </a>
        </Box>
      </Box>
    </Grid>
  );
};

export default LoginAdmin;
