import { Box, Container } from '@material-ui/core';
import { debounce } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { authenticateUser } from 'slice/userSlice';
import LoginAdmin from '../components/LoginAdmin/LoginAdmin';
import axiosService from '../config/axiosService';
import { AlertModal } from './../components/AlertModal/AlertModal';

function HomeCtn() {
  const dispatch = useDispatch();

  const handleLogin = debounce((maileOrPhone, password, setDisableBtn) => {
    const url = `admin/login`;
    const data = {
      user_input: maileOrPhone,
      password,
    };
    const options = {};

    axiosService
      .post(url, data, options)
      .then(async (res) => {
        const { token } = res.data;
        await dispatch(authenticateUser(token));
        // getUserDataOfToken(userDispatch, token);
        setDisableBtn(false);
      })
      .catch((er) => {
        const alert_trigger = {
          title:
            er.response?.data?.message !== undefined
              ? er.response.data.message
              : 'Đã có lỗi gì đó!',
          timer: 2000,
          icon: 'error',
          description: '',
        };

        AlertModal(alert_trigger);
        setDisableBtn(false);
      });
  }, 200);

  return (
    <Box
      width='100%'
      bgcolor='primary.main'
      position='fixed'
      top='0'
      left='0'
      zIndex='1200'>
      <Container>
        <LoginAdmin handleLogin={handleLogin} />
      </Container>
    </Box>
  );
}

export default HomeCtn;
