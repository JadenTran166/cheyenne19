import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import Footer from 'components/Layout/Footer';
import Header from 'components/Layout/Header';
import Loading from 'components/Layout/Loading';
// import MiniPortal from 'components/MiniPortal';
import OverlayLoading from 'components/Layout/OverlayLoading';
import RouteWithSubRoutes from 'components/RouteWithSubRoutes';
import Sidebar from 'components/Sidebar';
import axiosService from 'config/axiosService';
import useQuery from 'hooks/useQuery';
import useUserData from 'hooks/useUserData';
import React, { lazy, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
  getInitData as getInitDataGlobal,
  updatePrevLocationPath,
} from 'slice/global';
import { cancleConfigTheme, setThemKey } from 'slice/themeSlice';
import { authenticateUser, endLoadingAuthen } from 'slice/userSlice';
import { getCookie, setCookie } from 'utils';
import routes, { listRouteByKey } from '../config/configureRoute';
import socketService from '../config/socketService';
import 'bootstrap-daterangepicker/daterangepicker.css';
const drawerWidth = 250;

const NoMatch = lazy(() => import('./NoMatch'));
const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  miniPortal: {
    right: '1rem',
    top: '3rem',
    position: 'fixed',
    opacity: 'unset',
  },
  root: {},
  colorWrap: {
    background: 'rgba(235, 239, 245, 0.8)',
    minWidth: '100%',
    minHeight: '100%',
    zIndex: 1,
    position: 'fixed',
    overflow: 'hidden',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: '100%',
  },
  contentShift: {
    // transition: theme.transitions.create('width', {
    //   easing: theme.transitions.easing.easeOut,
    //   duration: theme.transitions.duration.enteringScreen,
    // }),
    // marginLeft: 'auto',
    // width: `calc(100vw - ${drawerWidth}px)`,
  },
}));

export default function App() {
  const { userData, isLoadingAuthen, isLogin } = useUserData();
  const [isMiniPortalOpen, setIsMiniPortalOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const global = useSelector((state) => state.global);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  // const [isLoadingInitData, setIsLoadingInitData] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };
  const handleAuthenticate = () => {
    const tk = getCookie('germany_admin_token');
    if (tk) {
      dispatch(authenticateUser(tk)).then(() => {
        dispatch(endLoadingAuthen());
      });
    } else {
      dispatch(endLoadingAuthen());
    }

    history.listen((location) => {
      if (global.prevLocationPath !== location.pathname) {
        dispatch(updatePrevLocationPath(location.pathname));
        setOpen(false);
      }
    });
  };

  async function getInitData() {
    try {
      await dispatch(getInitDataGlobal());
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    socketService.initSocket();
    const otp = query.get('otp');
    const id = query.get('id');
    if (otp && id) {
      axiosService
        .post('/users/otp-validate', {
          otp,
          id,
        })
        .then((res) => {
          const tk = res.data.token;
          setCookie('germany_admin_token', tk);
          dispatch(authenticateUser(tk)).then(() => {
            dispatch(endLoadingAuthen());
          });
        })
        .catch((err) => {
          handleAuthenticate();
        });
    } else {
      handleAuthenticate();
    }

    getInitData();
    return () => socketService.disconnectSocket();
  }, []);

  useEffect(() => {
    if (userData?._id) {
      socketService.emitEvent('INIT_ID', {
        id: userData?._id,
      });
    }
  }, [userData?._id]);

  useEffect(() => {
    dispatch(cancleConfigTheme());
  }, [global.prevLocationPath]);

  useEffect(() => {
    if (isLogin && !userData?.site?.color) {
      history.push(listRouteByKey['config_theme'].path);
    } else {
      dispatch(setThemKey(userData?.site?.color));
    }
  }, [isLogin]);

  return (
    <OverlayLoading isLoading={global.isLoadingOverlay} color='secondary'>
      {isLoadingAuthen || global.isLoadingInitData ? (
        <Box minHeight='100vh' display='flex'>
          <Loading />
        </Box>
      ) : (
        <Box
          minHeight='100vh'
          display='flex'
          flexDirection='column'
          className={classes.root}>
          {/* <div className={isMiniPortalOpen ? classes.colorWrap : ''}>
            <Box className={classes.miniPortal}>
              <MiniPortal
                openMiniPortal={() => {
                  setIsMiniPortalOpen(!isMiniPortalOpen);
                }}
              />
            </Box>
          </div> */}

          <Header handleToggle={handleToggle} />
          <Sidebar
            open={open}
            drawerWidth={drawerWidth}
            handleToggle={handleToggle}
          />
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}>
            <div className={classes.offset} />
            <Box flexGrow='1'>
              <React.Suspense fallback={<Loading />}>
                <Switch>
                  {routes.map((route, i) => (
                    <RouteWithSubRoutes key={i} {...route} />
                  ))}
                  <Route path='*' component={NoMatch} />
                </Switch>
              </React.Suspense>
            </Box>
          </main>
          <Footer />
        </Box>
      )}
    </OverlayLoading>
  );
}
