import { Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { scroller } from 'react-scroll';

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    maxWidth: 250,
    position: 'fixed',
    right: '5vw',
    top: 144,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  tabs: {
    borderLeft: `1px solid ${theme.palette.divider}`,
    '& span': {
      left: '0 !important',
      textTransform: 'none !important',
    },
    '& .MuiTab-textColorInherit.Mui-selected': {
      color: theme.palette.primary.main,
    },
    '& .MuiTab-wrapper': {
      alignItems: 'flex-start',
    },
  },
}));

const TabScrollVerticalNavigate = forwardRef((props, ref) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const scrollTo = (section) => {
    scroller.scrollTo(section, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation='vertical'
        value={value}
        variant='scrollable'
        onChange={handleChange}
        aria-label='Vertical tabs'
        className={classes.tabs}>
        <Tab
          label='Thông tin cơ bản'
          onClick={() => scrollTo('basic_info')}
          {...a11yProps(0)}
        />
        <Tab
          label='Thành phần'
          onClick={() => scrollTo('ingredient')}
          {...a11yProps(1)}
        />
        <Tab
          label='Thành phần dinh dưỡng'
          onClick={() => scrollTo('nutritional_ingredient')}
          {...a11yProps(2)}
        />
        <Tab
          label='Thông tin bán'
          onClick={() => scrollTo('sale_info')}
          {...a11yProps(3)}
        />
      </Tabs>
    </div>
  );
});
export default TabScrollVerticalNavigate;
