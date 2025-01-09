import React, { useState, useEffect } from 'react';
import {
  useHistory,
  useLocation,
  useParams,
  Route,
  Switch,
} from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Menu from '../../components/ClientManagement/Menu';
import RetailSellerItem from '../../components/ClientManagement/Retail/Item.js';
import WholesaleSellerItem from '../../components/ClientManagement/Wholesale/Item.js';
import BusinessItem from '../../components/CompanyManagement/Business/Item.js';
import { USER_TYPE } from '../../constants/common';
import Grid from '@material-ui/core/Grid';
import axiosService from '../../config/axiosService';
import Box from '@material-ui/core/Box';

import { matchPath } from 'react-router';

import useUserData from 'hooks/useUserData';
import { listRouteByKey } from 'config/configureRoute';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    backgroundColor: '#F7F7F7',
    width: '100%',
  },
}));

export default function ConnectedManagementCtn(props) {
  const classes = useStyles();
  const location = useLocation();
  const params = useParams();
  const { userData } = useUserData();

  const isConnectedClientRoute =
    (props.location.isConnectedClientRoute
      ? props.location.isConnectedClientRoute
      : location.state?.isConnectedClientRoute) ??
    params.isConnectedClientRoute;

  const [state, setState] = useState({
    categories: [],
  });
  const handleFilterBySubCategory = (subCategoryId, subCategoryName) => {
    setState({
      ...state,
      subCategoryFilter: subCategoryId,
    });
  };
  useEffect(() => {
    async function getUserInfo() {
      const categories = await axiosService.get(`/category`);
      setState({
        categories: categories.data,
      });
    }
    getUserInfo();
  }, [isConnectedClientRoute]);
  return (
    <Box className={classes.root} mb={4}>
      <div>
        <Grid container className={classes.root}>
          <Grid item xs={3}>
            <Menu
              isHideFilter={
                userData.seller_type === USER_TYPE.RETAIL &&
                matchPath(location.pathname, {
                  path: listRouteByKey.manage_connected_site.path + '/customer',
                })
              }
              handleFilterBySubCategory={handleFilterBySubCategory}
            />
          </Grid>
          <Grid item xs={9}>
            <Switch>
              <Route
                path={[
                  listRouteByKey.manage_connected_site.path + '/customer/:id',
                  listRouteByKey.manage_connected_site.path + '/customer',
                ]}>
                {userData.seller_type === USER_TYPE.WHOLE_SALE ? (
                  <WholesaleSellerItem
                    subCategoryFilter={state.subCategoryFilter}
                  />
                ) : (
                  <RetailSellerItem
                    subCategoryFilter={state.subCategoryFilter}
                  />
                )}
              </Route>

              <Route
                exact
                path={[
                  listRouteByKey.manage_connected_site.path + '/:id',
                  listRouteByKey.manage_connected_site.path,
                ]}>
                <BusinessItem subCategoryFilter={state.subCategoryFilter} />
              </Route>
            </Switch>
            {/* {isConnectedClientRoute ? (
              userData.seller_type === USER_TYPE.WHOLE_SALE ? (
                <WholesaleSellerItem
                  subCategoryFilter={state.subCategoryFilter}
                />
              ) : (
                <RetailSellerItem subCategoryFilter={state.subCategoryFilter} />
              )
            ) : (
              <BusinessItem subCategoryFilter={state.subCategoryFilter} />
            )} */}
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}
