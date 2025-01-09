import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import AppsIcon from '@material-ui/icons/Apps';
import cn from 'classnames';
import useGetFeature from 'containers/PortalCtn/hooks/useGetFeature';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import FeatureItem from '../Portal/FeatureItem';
import FeatureListLayout from '../Portal/FeatureListLayout';

const useStyles = makeStyles((theme) => ({
  ctn: {
    position: 'relative',
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
    padding: theme.spacing(3),
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
      borderBottom: '0.75rem solid white',
    },
  },
  notiItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    color: '#000',
    borderBottom: '1px solid #707070',
    cursor: 'pointer',
    transition: '0.2s background-color',
    '&:hover': {
      backgroundColor: '#d7e2f4',
    },
  },
  icon: {
    marginRight: theme.spacing(1.5),
    minWidth: '3.625rem',
    height: '2.875rem',
  },
  svgIcon: {
    width: '3rem',
    height: '3rem',
    fill: theme.palette.primary.main,
  },
  content: {
    marginLeft: 10,
    minWidth: '72%',
  },
  notiList: {
    margin: 0,
    padding: 0,
    maxHeight: 410,
    minHeight: 410,
    overflowY: 'scroll',
  },
  bold: {
    color: '#EF7F00',
    fontWeight: 600,
  },
  contentDetail: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: '20px',
    '& b': {
      color: theme.palette.primary.main,
      fontWeight: 700,
      fontSize: 18,
      fontFamily: 'inherit',
    },
    textAlign: 'left',
  },
  time: {
    marginTop: 6,
    fontSize: 10,
  },
  title: {
    fontSize: '20px',
    lineHeight: '27px',
    color: theme.palette.primary.main,
    margin: '12px',
    fontWeight: 700,
    textAlign: 'left',
  },
  loadMore: {
    padding: '6px',
    fontSize: '14px',
    textAlign: 'center',
    color: 'primary',
  },
  loadMoreText: {
    color: '#EF7F00',
    fontWeight: 500,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  readStatus: {
    minWidth: 10,
    minHeight: 10,
    background: theme.palette.primary.main,
    borderRadius: '50%',
  },
  root: {
    maxHeight: '415px',
    overflow: 'overlay',
  },
}));
const DEFAULT_COLUMN = 3;
export default function MiniPortal(props) {
  const classes = useStyles();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const features = useGetFeature(true);
  const listFeature =
    features &&
    features.map((item) => (
      <FeatureItem
        small
        key={item.key}
        onClick={() => {
          if (typeof item.onClick === 'function') {
            item.onClick();
          } else {
            history.push(item.link);
          }
          setIsOpen(false);
        }}
        src=''
        data={item}
        isSpecial={item.isSpecial}
        isLock={item.isLock}>
        {item.name}
      </FeatureItem>
    ));
  useEffect(() => {
    // getNotificationList();
    // countUnreadNotification();
  }, []);

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <div className={classes.ctn}>
        <Tooltip title='Thông báo'>
          <IconButton
            color='inherit'
            onClick={async () => {
              setIsOpen(!isOpen);
            }}>
            <AppsIcon />
          </IconButton>
        </Tooltip>
        <div
          className={cn({
            [classes.root]: true,
            [classes.notificationContainer]: isOpen,
            [classes.isNotOpen]: !isOpen,
          })}>
          <FeatureListLayout
            maxHeight='415px'
            column={DEFAULT_COLUMN}
            row={Math.ceil(listFeature.length / DEFAULT_COLUMN)}
            min={'105px'}
            max={'105px'}>
            {listFeature}
          </FeatureListLayout>
        </div>
      </div>
    </ClickAwayListener>
  );
}
