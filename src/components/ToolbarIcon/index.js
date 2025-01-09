import { Badge, IconButton, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { BaseIcon } from 'assets/icon/BaseIcon';
import axiosService from 'config/axiosService';
import useUserData from 'hooks/useUserData';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartTotalProduct } from 'slice/cartSlice';
import { ENV_GERMANY_ENDPOINT } from '../../env/local';
import MiniPortal from '../MiniPortal';
import Notification from '../Notification';
import UserInfo from '../UserInfo';
const { Cart } = BaseIcon;

const useStyle = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    button: {
      color: 'rgba(255,255,255)',
    },
  };
});
export default function ToolbarIcon(props) {
  const classes = useStyle();
  const dispatch = useDispatch();
  const { userData } = useUserData();
  const { cartTotalProduct } = useSelector((state) => {
    return state?.cart;
  });

  const handleFinding = () => {
    // Need to refactor with useGetfeature #phuc_1
    axiosService
      .post('/users/otp-generate')
      .then((res) => {
        const { otp } = res.data;
        const link = `${ENV_GERMANY_ENDPOINT}explore/sites?filter=wholesale&otp=${otp.key}&id=${props.userData._id}`;
        window.open(link);
      })
      .catch((err) => {
        alert(err);
        console.error(err);
      });
  };

  useEffect(() => {
    axiosService.get(`/cart`, {}).then((res) => {
      dispatch(updateCartTotalProduct(res?.data?.quantity || 0));
    });
  }, [userData]);

  return (
    <Box className={classes.root}>
      <Button
        className={classes.button}
        onClick={() => window.open(ENV_GERMANY_ENDPOINT)}>
        <Typography>Về cheyenne19</Typography>
      </Button>
      <Button className={classes.button} onClick={handleFinding}>
        <Typography>Tìm nguồn hàng</Typography>
      </Button>
      <Notification />
      <Tooltip title='Giỏ hàng'>
        <IconButton
          color='inherit'
          onClick={() => {
            window.location.href = `${ENV_GERMANY_ENDPOINT}cart`;
          }}>
          <Badge badgeContent={cartTotalProduct} color='secondary'>
            <Cart color='inherit' />
          </Badge>
        </IconButton>
      </Tooltip>
      <MiniPortal />
      <UserInfo
        name={`${
          props?.userData?.first_name ? props?.userData?.first_name + ' ' : ''
        } ${props.userData.name}`}
      />
    </Box>
  );
}
