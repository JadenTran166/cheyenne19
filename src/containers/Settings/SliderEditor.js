import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import TabPanel from './TabPanel';
import TabPanelDetail from './TabPanelDetail';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabPanel: {
    width: '100%',
    '& img': {
      maxWidth: '100%',
    },
  },
}));

const MAX_BANNER = 3;

function SliderEditor(props, ref) {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);

  const tabPanelDetailsRef = useRef([...new Array(MAX_BANNER)]);
  const [bannerDataCustom, setBannerDataCustom] = useState([]);

  const handleChangeTab = async (e, newValue) => {
    setTabValue(newValue);
  };

  function onSubmitData() {
    return tabPanelDetailsRef.current.map((item) => item.getFormValue());
  }

  useImperativeHandle(ref, () => ({
    getFormValue: onSubmitData,
  }));

  useEffect(() => {
    const newState = [];

    if (props.siteData?.banners?.length) {
      props.siteData.banners.forEach((item) => {
        newState[item.priority] = { ...item };
      });
    }

    setBannerDataCustom(newState);
  }, [props.siteData]);

  return (
    <Box>
      {[...Array(MAX_BANNER).keys()].map((item, index) => {
        return (
          <TabPanel
            key={`$tab_pabel_${index}`}
            className={classes.tabPanel}
            value={tabValue}
            index={index}>
            <TabPanelDetail
              ref={(el) => {
                tabPanelDetailsRef.current[index] = el;
              }}
              index={index}
              onUpdateBanner={props.onUpdateBanner}
              bannerData={bannerDataCustom[item]}
              newBannerImgData={props.bannerData[index]}
            />
          </TabPanel>
        );
      })}

      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        aria-label='simple tabs example'>
        <Tab label='Banner 1' />
        <Tab label='Banner 2' />
        <Tab label='Banner 3' />
      </Tabs>
    </Box>
  );
}

export default forwardRef(SliderEditor);
