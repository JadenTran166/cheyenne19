import { Box, Button, Divider, SvgIcon } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PowerIcon from '@material-ui/icons/ExitToApp';
import UserIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import { listRouteByKey } from 'config/configureRoute';
import useCustomHistory from 'hooks/useCustomHistory';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from 'slice/userSlice';

const useStyles = makeStyles((theme) => ({
  ctn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  isNotOpen: {
    display: 'none',
  },
  notificationContainer: {
    position: 'absolute',
    borderRadius: '10px',
    zIndex: 9999,
    top: '3rem',
    // right: '6.5rem',
    right: '0',

    [theme.breakpoints.down(1440)]: {
      // right: '4rem',
      top: '3.4rem',
    },
    minWidth: '200px',
    fontWeight: 300,
    background: '#ffffff',
    boxSizing: 'border-box',
    boxShadow: '0.5rem 0.5rem 2rem 0 rgba(0, 0, 0, 0.2)',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    '&::before': {
      content: "' '",
      position: 'absolute',
      top: '1px',
      right: '-10.5rem',
      width: 0,
      height: 0,
      transform: 'translate(-11.25rem, -100%)',
      borderLeft: '0.75rem solid transparent',
      borderRight: '0.75rem solid transparent',
      // borderBottom: '0.75rem solid white',
    },
  },
  notiItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    color: '#000',
    // borderBottom: '1px solid #707070',
    cursor: 'pointer',
    transition: '0.2s background-color',
    '&:hover': {
      backgroundColor: '#d7e2f4',
    },
  },
  // icon: {
  //   marginRight: theme.spacing(1.5),
  //   minWidth: '3.625rem',
  //   height: '2.875rem',
  // },
  svgIcon: {
    marginRight: theme.spacing(1),
    fill: theme.palette.grey[700],
  },
  // content: {
  //   marginLeft: 10,
  //   minWidth: '72%',
  // },
  notiList: {
    padding: 0,
  },
  infoButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeft: '1px solid #ffffff85',
    borderRadius: 0,
    '& p': {
      fontWeight: 'bold',
      marginLeft: '10px',
    },
  },
}));

export default function UserInfo({ name }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { goTo } = useCustomHistory();
  const handleLogout = async () => {
    await dispatch(logout());
    history.push(listRouteByKey['login'].path);
  };
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    // getNotificationList();
    // countUnreadNotification();
  }, []);

  return (
    <ClickAwayListener onClickAway={() => setIsNotificationOpen(false)}>
      <div className={classes.ctn}>
        <Tooltip title='Tài khoản'>
          <Button
            color='inherit'
            onClick={async () => {
              setIsNotificationOpen(true);
            }}
            className={classes.infoButton}>
            <PersonIcon />
            <Typography>{name}</Typography>
          </Button>
        </Tooltip>
        <div
          className={
            isNotificationOpen
              ? classes.notificationContainer
              : classes.isNotOpen
          }>
          <ul className={classes.notiList}>
            <li
              className={classes.notiItem}
              onClick={() => {
                setIsNotificationOpen(false);
                goTo('settings');
              }}>
              <SvgIcon className={classes.svgIcon}>
                <UserIcon />
              </SvgIcon>
              <div className={classes.content}>
                <Typography className={classes.contentDetail} component='div'>
                  Thông tin người dùng
                </Typography>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'></Box>
              </div>
            </li>
            <Divider />
            <li className={classes.notiItem} onClick={handleLogout}>
              <SvgIcon className={classes.svgIcon}>
                <PowerIcon />
              </SvgIcon>
              <div className={classes.content}>
                <Typography className={classes.contentDetail} component='div'>
                  Đăng xuất
                </Typography>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'></Box>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </ClickAwayListener>
  );
}
