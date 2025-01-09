import { Box, makeStyles } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import axiosService from 'config/axiosService';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Alert } from 'utils';
import useQuery from '../../hooks/useQuery';
import EditProfile from './EditProfile';
import EditSharing from './EditSharing';
import LayoutSettings from './LayoutSettings';
import TabPanel from './TabPanel';
const useStyles = makeStyles((theme) => ({
  root: {},
  tabPanel: {
    width: '100%',
    '& img': {
      maxWidth: '100%',
    },
  },
}));

const SettingsCtn = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState(true);

  const [initData, setInitData] = useState({});
  const query = useQuery();
  const history = useHistory();

  useEffect(() => {
    const enumTab = [0, 1, 2];
    const tabKey = +query.get('tab');

    if (tabKey && enumTab.includes(tabKey)) {
      setValue(tabKey);
    }
  }, []);

  function handleChangeTab(event, newValue) {
    setValue(newValue);
    history.replace(`${history.location.pathname}?tab=${newValue}`);
  }

  async function getInitData() {
    try {
      const initData = await Promise.all([
        axiosService.get('/business-resource').then((res) => res.data),
        axiosService.get('/category').then((res) => res.data),
        axiosService.get('/provinces').then((res) => res.data),
      ]);

      setInitData({
        ...initData[0],
        categories: initData[1],
        addressSampleData: initData[2],
      });
    } catch (error) {
      console.error(error);
      Alert.fire({
        title: 'Load init data fail.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInitData();
  }, []);

  return (
    <Box mt={4}>
      <Tabs
        value={value}
        onChange={handleChangeTab}
        aria-label='simple tabs example'>
        <Tab label='Cài đặt hồ sơ' />
        <Tab label='Cài đặt giao diện' />
        <Tab label='Cài đặt chia sẻ' />
      </Tabs>

      <TabPanel
        key={`$tab_pabel_${0}`}
        className={classes.tabPanel}
        value={value}
        index={0}>
        {/* PROFILE SETTING */}
        {!loading && initData && <EditProfile initData={initData} />}
      </TabPanel>

      <TabPanel
        key={`$tab_pabel_${1}`}
        className={classes.tabPanel}
        value={value}
        index={1}>
        {/* UI SETUP */}
        <LayoutSettings />
      </TabPanel>

      {/* SETUP SRC TREE */}
      <TabPanel
        key={`$tab_pabel_${2}`}
        className={classes.tabPanel}
        value={value}
        index={2}>
        {/* PROFILE SETTING */}
        <EditSharing />
      </TabPanel>
    </Box>
  );
};
export default SettingsCtn;
