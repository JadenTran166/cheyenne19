import { Box, IconButton, makeStyles } from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import React from 'react';
import { ENV_ASSETS_ENDPOINT } from 'env/local';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid #efefef',
    backgroundColor: 'white',
    borderRadius: 5,
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 4px 4px 0px;',
  },
  action: {
    padding: 0,
    justifyContent: 'center',
  },
  button: {
    padding: 5,
  },
  img: {
    width: 150,
  },
  vipColor: {
    color: theme.palette.secondary.main,
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
}));
export default function TreeNode(props) {
  const classes = useStyles();
  const { nodeDatum, toggleNode, openDetail } = props;
  const isRootNode = !!nodeDatum.isRoot;

  return (
    <Box className={classes.root}>
      <Box
        p={!isRootNode ? 2 : 0}
        pb={nodeDatum?.children?.length > 0 ? 0 : 2}
        onClick={() => {
          openDetail(isRootNode ? null : nodeDatum);
        }}>
        {!isRootNode && (
          <Box fontSize={14} color='#a5a5a5' mb={1}>
            {nodeDatum?.connectedDate || ''}
          </Box>
        )}
        <Box
          className={classes.imageWrapper}
          border={1}
          height={isRootNode ? 200 : 150}
          borderColor='#efefef'
          mb={1}>
          <img
            draggable='false'
            className={classes.img}
            src={`${ENV_ASSETS_ENDPOINT}${nodeDatum?.logo}`}
            alt={'site'}
          />
        </Box>
        {!isRootNode && (
          <>
            <Box
              fontSize={18}
              className={nodeDatum.isVip ? classes.vipColor : {}}
              style={
                nodeDatum.isVip
                  ? {}
                  : { color: nodeDatum.connectedDate ? '#2DCF58' : '#f20d0d' }
              }>
              {nodeDatum.connectedDate
                ? nodeDatum.isVip
                  ? 'Khách Hàng Vip'
                  : 'Đã Liên Kết'
                : 'Chưa liên kết'}
            </Box>
            <Box
              fontSize={18}
              color='primary.main'
              fontWeight='bold'
              whiteSpace='nowrap'>
              {nodeDatum?.name}
            </Box>
            <Box fontSize={18} color='primary.main'>
              Đã copy:{' '}
              <Box fontSize={18} component='span' fontWeight='bold'>
                {nodeDatum?.totalCopiedProducts}
              </Box>
            </Box>
          </>
        )}
      </Box>
      {nodeDatum?.children?.length > 0 && (
        <Box className={classes.action} display='flex'>
          <IconButton
            onClick={toggleNode}
            aria-label='show more'
            className={classes.button}>
            {nodeDatum.__rd3t.collapsed ? (
              <ExpandMoreIcon color='primary' />
            ) : (
              <ExpandLessIcon color='primary' />
            )}
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
