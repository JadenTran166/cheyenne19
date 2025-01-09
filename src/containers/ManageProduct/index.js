import { Box, Button, Paper } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CommonModal from 'components/CommonModal';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { listRouteByKey } from '../../config/configureRoute';
import CopyConnectedProductModal from './CopyConnectedProductModal';
import RightManageProduct from './RightManageProduct';
const useStyles = makeStyles((theme) => ({
  root: {},
  hiddenFileInput: {
    width: 0,
    height: 0,
    position: 'relative',
    zIndex: 2,
    opacity: 0,
  },
  groupAction: {
    '& .MuiButton-label': {
      textTransform: 'uppercase',
      alignItems: 'center',
    },
  },
}));
export default function ManageProduct() {
  const history = useHistory();
  const classes = useStyles();
  const [openCopyModal, setOpenCopyModal] = useState(false);

  return (
    <Box mt={4} className={classes.root}>
      <Box>
        <Box
          mb={3}
          display='flex'
          justifyContent='flex-end'
          alignItems='center'
          className={classes.groupAction}>
          <Box mr={1}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                setOpenCopyModal(true);
              }}>
              <Box color='secondary.main' component='span'>
                Copy sản phẩm từ site liên kết
              </Box>
            </Button>
          </Box>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              history.push(listRouteByKey['copy_product'].path);
            }}>
            <Box color='secondary.main' component='span'>
              Copy sản phẩm
            </Box>
          </Button>
          <Box ml={1}>
            <Link to={listRouteByKey['create_product'].path}>
              <Button variant='contained' color='primary'>
                <Box color='secondary.main' component='span'>
                  Tạo sản phẩm
                </Box>
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
      <Box component={Paper}>
        <RightManageProduct />
      </Box>
      <CommonModal
        isOpen={openCopyModal}
        handleClose={() => {
          setOpenCopyModal(false);
        }}
        maxWidth='md'>
        <CopyConnectedProductModal setOpenCopyModal={setOpenCopyModal} />
      </CommonModal>
    </Box>
  );
}
