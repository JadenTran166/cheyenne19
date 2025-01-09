import {
  AppBar,
  Box,
  Container,
  Icon,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useUserData from 'hooks/useUserData';
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import routes, { listRouteByKey } from '../../config/configureRoute';
import ToolbarIcon from '../ToolbarIcon';
// import cls from "classnames";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    cursor: 'pointer',
  },
  breadScrumIcon: {
    opacity: 0.5,
    margin: '0 10px',
  },
  whiteColor: {
    color: 'white',
  },
  toggleButtonIcon: {
    minWidth: '50px',
    color: 'white',
  },
}));
export default function Header(props) {
  const history = useHistory();
  const { userData } = useUserData();
  const goHome = () => {
    history.push(listRouteByKey['home'].path);
  };

  const classes = useStyles();
  return (
    <AppBar>
      <Toolbar disableGutters>
        <Container maxWidth={false}>
          <Box className={classes.root}>
            {/* <CheyenneIcon
              color="secondary"
              fontSize="large"
              width="132px"
              height="20px"
              onClick={() => {
                history.push(listRouteByKey["home"].path);
              }}
            /> */}
            <Box display='flex' justifyContent='center' alignItems='center'>
              <Button
                className={classes.toggleButtonIcon}
                onClick={props.handleToggle}>
                <Icon>menu</Icon>
              </Button>
              <Typography
                color='secondary'
                variant='h5'
                onClick={goHome}
                className={classes.logo}>
                {userData?.site?.name || 'Company'}
              </Typography>
              <Icon className={classes.breadScrumIcon}>arrow_forward_ios</Icon>
              <Switch>
                {routes.map((route, i) => (
                  <Route key={i} exact path={route.path}>
                    <Typography
                      className={classes.whiteColor}
                      color='secondary'
                      variant='h6'>
                      {route.name}
                    </Typography>
                  </Route>
                ))}
              </Switch>
            </Box>
            <ToolbarIcon userData={userData} />
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
