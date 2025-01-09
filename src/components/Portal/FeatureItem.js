import React from 'react';
import {
  makeStyles,
  Typography,
  Box,
  Paper,
  Icon,
  ButtonBase,
  Badge,
  useTheme,
} from '@material-ui/core';
// import defaultImg from '../../assets/img/default_img.png';
// import { ASSETS_ENDPOINT } from '../../constants/common';

import { BaseIcon } from '../../assets/icon/BaseIcon';
import PropTypes from 'prop-types';

// let animateStar = `keyframes{
//   0% {
//     transform: scale(1) rotate3d(-1, 1, 0, 0deg);
//   }
//   50% {
//     transform: scale(0.4) rotate3d(-1, 1, 0, -90deg);
//   }
//   100% {
//     transform: scale(1) rotate3d(-1, 1, 0, -180deg);
//   }
// }`;

const useStyles = makeStyles((theme) => ({
  root: {
    // paddingBottom: theme.spacing(2),
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    height: (props) => (props.small ? '100%' : '192px'),
    alignSelf: 'start',
    // boxShadow: theme.shadows[1],
    '&:hover': {
      // boxShadow: theme.shadows[5],
      boxShadow: (props) => (props.isLock ? null : theme.shadows[5]),
    },
    // backgroundColor: (props) => (props.isBig ? '#818181' : null),
    backgroundColor: theme.palette.primary.main,
  },
  btnContainer: {
    width: '100%',
    height: '100%',
  },
  iconBadgeStar: {
    right: '50%',
    top: '50%',
    position: 'absolute',
  },
}));
export default function FeatureItem(props) {
  const classes = useStyles(props);
  const theme = useTheme();
  const { data, isSpecial, isLock } = props;
  // const [rColor] = useState(() => {
  //   let arrColor = [
  //     '#7b1fa2',
  //     '#c2185b',
  //     '#d32f2f',
  //     '#512da8',
  //     '#303f9f',
  //     '#1976d2',
  //     '#00796b',
  //     '#0288d1',
  //     '#0097a7',
  //     '#388e3c',
  //     '#5d4037',
  //     '#455a64',
  //     '#e64a19',
  //     '#616161',
  //     '#f57c00',
  //     '#fbc02d',
  //     '#689f38',
  //     '#afb42b',
  //     '#212121',
  //   ];
  //   return arrColor[Math.floor(Math.random() * arrColor.length)];
  // });
  // if (isLock) {
  //   data.color = '#4f4a4a';
  // }

  const MyIcon = BaseIcon[data?.iconNew || 'Default'];
  return (
    <Badge
      badgeContent={
        isSpecial ? (
          <Icon className={classes.iconBadgeStar} color='secondary'>
            star
          </Icon>
        ) : (
          <Icon className={classes.iconBadgeStar} style={{ color: '#4f4a4a' }}>
            lock
          </Icon>
        )
      }
      color='default'
      invisible={!(isSpecial || isLock)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      className={classes.btnContainer}>
      <ButtonBase
        onClick={props.onClick}
        className={classes.btnContainer}
        focusRipple={true}>
        <Paper className={classes.root} elevation={2}>
          {/* <Box px={1} py={2} minWidth='100'> */}
          <Box
            height={1}
            display='flex'
            flexDirection='column'
            justifyContent='flex-end'
            alignItems='center'>
            <Box mb={props.small ? 1 : 2}>
              <MyIcon
                width={props.small ? '20px' : '70px'}
                height={props.small ? '20px' : '70px'}
                color='secondary'
                restColor={theme.palette.primary.main}
              />
            </Box>
            <Box m={props.small ? 1 : 2}>
              <Typography
                variant={props.small ? 'caption' : 'body1'}
                // style={{ color: isBig ? '#fff' : '#000' }}
              >
                <Box
                  component='span'
                  // style={{ textTransform: 'capitalize' }}
                  fontWeight={'bold'}
                  color='primary.contrastText'>
                  {data?.name || 'NoName'}
                </Box>
              </Typography>
            </Box>
          </Box>
          {/* </Box> */}
        </Paper>
      </ButtonBase>
    </Badge>
  );
}

FeatureItem.defaultProps = {
  //   src: ,
  isBig: false,
};

FeatureItem.prototype = {
  src: PropTypes.string,
  isBig: PropTypes.bool,
};
