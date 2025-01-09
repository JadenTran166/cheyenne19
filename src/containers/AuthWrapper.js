import { listRouteByKey } from 'config/configureRoute';
import useCustomHistory from 'hooks/useCustomHistory';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { USER_ROLE, USER_TYPE } from '../constants/common';

export default function AuthWrapper({ isAuth, isManager, isOwner, isWholeSale, ...rest }) {
  const { userData, isLoadingAuthen } = useSelector((state) => {
    return state.user;
  });
  // const {userData,isLoadingAuthen} = useUserData();
  const { goTo } = useCustomHistory();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (isLoadingAuthen) return;

    if (!userData?._id && isAuth) {
      goTo('login');
    }

    if (userData?._id && location.pathname === listRouteByKey['login'].path) {
      goTo('home');
    }

    if (userData?._id && isOwner && userData.role !== USER_ROLE.OWNER) {
      goTo('404');
    }

    if (
      userData?._id &&
      isManager &&
      [USER_ROLE.OWNER, USER_ROLE.MANAGER].indexOf(userData.role) < 0
    ) {
      goTo('404');
    }

    if (userData?._id && isWholeSale && userData.seller_type !== USER_TYPE.WHOLE_SALE) {
      goTo('404');
    }

  }, [userData]);
  return <div>{rest.children}</div>;
}
