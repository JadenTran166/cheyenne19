import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { BaseIcon } from 'assets/icon/BaseIcon';
import clsx from 'clsx';
import CommonCollapseBox from 'components/CommonCollapseBox';
import { ASSETS_ENDPOINT, listSidebar } from 'constants/common';
import { useHistory } from 'react-router-dom';
import React from 'react';
import { Link } from 'react-router-dom';
import useUserData from 'hooks/useUserData';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    '&>.MuiDrawer-paper': {
      zIndex: 100,
      paddingTop: '60px', // Navbar height
      height: 'calc(100vh - 94px)', // Footer height
    },
  },
  list: {
    height: '100%',
  },
  drawer: {
    width: (props) => props.drawerWidth,
    flexShrink: 0,
    '&:before': {
      content: `''`,
      position: 'fixed',
      top: 0,
      left: 0,
      background: '#00000047',
      width: '100%',
      height: '100%',
      zIndex: 100,
      display: (props) => (props.open ? 'block' : 'none'),
    },
  },
  drawerPaper: {
    width: (props) => props.drawerWidth,
    height: '100% !important',
  },
  avatar: {
    borderRadius: '5px',
    border: '1px solid #d2d2d2',
    marginRight: '10px',
    cursor: 'pointer',
  },
  drawerHeader: {
    color: 'black',
    textDecoration: 'underline',
    display: 'flex',
    alignItems: 'center',
  },
  mainItem: {
    '& .MuiListItemIcon-root': {
      minWidth: '40px',
    },
  },
  nested: {},
  toggleButtonIcon: {
    minWidth: '30px',
    opacity: 0.5,
  },
  subText: {
    '& span': {
      opacity: 0.8,
    },
  },
}));
const Sidebar = (props) => {
  const { open } = props;
  const classes = useStyles(props);
  const history = useHistory();
  const { userData } = useUserData();

  return (
    <Drawer
      className={clsx(classes.drawer, classes.sidebar)}
      variant='persistent'
      anchor='left'
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}>
      <Box display='flex' p={2} className={classes.drawerHeader}>
        {/* <IconButton onClick={handleDrawerClose}>
        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton> */}
        <Avatar
          variant='square'
          src={
            userData?.site?.avatar
              ? `${ASSETS_ENDPOINT}${userData?.site?.avatar}`
              : ''
          }
          onClick={() => {
            history.push('/');
          }}
          className={classes.avatar}
        />
        <Link to='/cai-dat'>
          <Typography variant='subtitle1'>Hồ sơ công ty</Typography>
        </Link>
        <Box marginLeft='auto'>
          <Button
            className={classes.toggleButtonIcon}
            onClick={props.handleToggle}>
            <Icon>arrow_back_ios_new</Icon>
          </Button>
        </Box>
      </Box>
      <Divider />
      <List className={classes.list}>
        {listSidebar
          .filter(
            (item) =>
              !item.role || (item?.role && item?.role.includes(userData.role))
          )
          .map((sidebar) => {
            const MyIcon = BaseIcon[sidebar?.iconNew || 'Default'];
            return (
              <CommonCollapseBox
                mainTitle={sidebar.label}
                key={`sidebar_${sidebar.key}`}
                mainIcon={MyIcon}>
                <List component='div' disablePadding>
                  {sidebar.childs
                    .filter(
                      (item) =>
                        !item?.seller_type ||
                        (item?.seller_type &&
                          item?.seller_type === userData?.seller_type)
                    )
                    .map((child, index) => {
                      return (
                        <ListItem
                          key={`subsidebar_${child.key}_${index}`}
                          button
                          onClick={() => {
                            history.push('/' + child.path);
                          }}
                          className={classes.nested}>
                          <Box minWidth='30px'></Box>
                          <ListItemText
                            className={classes.subText}
                            primary={child.label}
                          />
                        </ListItem>
                      );
                    })}
                </List>
              </CommonCollapseBox>
            );
          })}
      </List>
      <Divider />
    </Drawer>
  );
};
export default Sidebar;
