import React from 'react';
import ListIcon from '@material-ui/icons/List';

import { Box, Button } from '@material-ui/core';
import { BaseIcon } from 'assets/icon/BaseIcon';
import { useLocation } from 'react-router';
import { listRouteByKey } from 'config/configureRoute';
import useCustomHistory from 'hooks/useCustomHistory';

const GroupSwitchLayout = () => {
  const location = useLocation();
  const { goTo } = useCustomHistory();

  const isTableLayout = location.pathname === listRouteByKey['tracking'].path;
  return (
    <Box display='flex' justifyContent='end' mb={2}>
      <Box mr={2}>
        <Button
          variant={isTableLayout ? 'outlined' : 'contained'}
          color='primary'
          startIcon={<BaseIcon.Schema />}
          onClick={() => {
            goTo('tracking_list');
          }}>
          Sơ đồ
        </Button>
      </Box>

      <Button
        variant={isTableLayout ? 'contained' : 'outlined'}
        startIcon={<ListIcon />}
        color='primary'
        onClick={() => {
          goTo('tracking');
        }}>
        Bảng
      </Button>
    </Box>
  );
};

export default GroupSwitchLayout;
