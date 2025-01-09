import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { AlertModal } from 'components/AlertModal/AlertModal';
import axiosService from 'config/axiosService';
import { ENV_ASSETS_ENDPOINT } from 'env/local';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert } from 'utils';
import defaultImg from '../../assets/img/default_img.png';

const common_font_size = '18px';
const common_spacing = '18px';

const useStyles = makeStyles((theme) => ({
  root: {
    '& li': {
      backgroundColor: 'white!important',
    },
    '& .MuiSelect-select:focus': {
      backgroundColor: 'white!important',
    },
  },
  header: {
    padding: `${common_spacing} 0`,
  },
  subTitle: {
    padding: '0 0 10px 28px',
  },
  title: {
    fontWeight: 500,
    paddingTop: common_spacing,
  },
  form: {
    borderRadius: 5,
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25);',
  },
  form_header: {
    padding: '20px 28px 35px',
  },
  form_main: {
    padding: '0 28px',
  },
  form_footer: {
    padding: '15px 24px 30px',
    textAlign: 'end',
  },
  cardList: {
    maxHeight: '62vh',
    overflow: 'auto',
    padding: 11,
  },
  cardWrapper: {
    marginTop: 20,
    boxShadow: '0px 2px 10px rgb(0 0 0 / 25%)',
    display: 'flex',
    alignItems: 'center',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  imgWrapper: {
    border: '1px solid #E9EDEB',
    height: 100,
    maxWidth: 100,
    boxSizing: 'border-box',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  },
  name: {
    fontWeight: 500,
    fontSize: 18,
  },
  button: {
    marginLeft: 'auto',
  },
}));
export default function CopyConnectedProductModal(props) {
  const history = useHistory();
  const classes = useStyles();
  const { setOpenCopyModal } = props;
  const [connectedSite, setConnectedSite] = useState([]);
  const [inCopyProcess, setInCopyProcess] = useState(null);

  const handleBackClick = (e) => {
    setOpenCopyModal(false);
  };

  const fetchSiteData = () => {
    axiosService
      .get('/connect', { status: 'accepted', limit: 100 })
      .then((res) => {
        setConnectedSite(res.data.connected_site);
      })
      .catch((err) => {
        console.error(err);
        const messageTrigger = {
          title:
            err?.response?.data?.message ||
            'Không thể lấy danh sách site đã liên kết',
          timer: 1500,
          icon: 'error',
        };
        AlertModal(messageTrigger);
      });
  };

  const showConfirmModal = (data) => {
    Alert.fire({
      icon: 'info',
      title: `Bạn có muốn copy toàn bộ sản phẩm từ công ty ${
        data?.connected_site?.name || ''
      } ?`,
      showCancelButton: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleCopyAllProduct(data);
      }
    });
  };

  const handleCopyAllProduct = (connected) => {
    setInCopyProcess(connected._id);
    if (connected?.accept_site?._id) {
      axiosService
        .post(
          '/copy-all-products',
          { imported_site_id: connected?.accept_site?._id },
          {}
        )
        .then((res) => {
          const messageTrigger = {
            title: 'Copy thành công!',
            timer: 1500,
            icon: 'success',
          };
          AlertModal(messageTrigger);
          setInCopyProcess(null);
        })
        .catch((err) => {
          console.error(err);
          const messageTrigger = {
            title:
              err?.response?.data?.message ||
              `Không thể copy toàn bộ sản phẩm từ site ${connected?.accept_site?.name}`,
            timer: 1500,
            icon: 'error',
          };
          AlertModal(messageTrigger);
          setInCopyProcess(null);
        });
    } else {
      const messageTrigger = {
        title: 'Không tồn tại id của site đã liên kết',
        timer: 1500,
        icon: 'error',
      };
      AlertModal(messageTrigger);
    }
  };

  useEffect(() => {
    fetchSiteData();
  }, []);

  return (
    <Box className={classes.root}>
      <Box className={classes.form}>
        <Box className={classes.form_header}>
          <Typography variant='h5' className={classes.title}>
            Copy tất cả sản phẩm từ site liên kết
          </Typography>
        </Box>

        <Box className={classes.subTitle}>
          <Typography>Chọn một site đã liên kết bên dưới để copy: </Typography>
        </Box>

        <Box className={classes.form_main}>
          <Box className={classes.cardList}>
            {connectedSite?.length > 0 ? (
              connectedSite.map((item) => {
                return (
                  <Box key={item?._id} className={classes.cardWrapper} p={2}>
                    <Box className={classes.imgWrapper} mr={4}>
                      <img
                        alt='site img'
                        className={classes.image}
                        src={
                          item?.accept_site?.avatar
                            ? `${ENV_ASSETS_ENDPOINT}${item?.accept_site?.avatar}`
                            : defaultImg
                        }
                      />
                    </Box>
                    <Box className={classes.name}>
                      {item?.accept_site?.name || ''}
                    </Box>
                    <Box className={classes.button}>
                      <Button
                        variant='contained'
                        color='primary'
                        disabled={inCopyProcess}
                        style={{
                          minWidth: 180,
                        }}
                        onClick={() => {
                          showConfirmModal(item);
                        }}>
                        {inCopyProcess && inCopyProcess === item?._id ? (
                          <CircularProgress
                            size={20}
                            thickness={4}
                            color='secondary'
                          />
                        ) : (
                          'Copy toàn bộ sản phẩm'
                        )}
                      </Button>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box textAlign='center'>Bạn chưa liên kết với công ty nào</Box>
            )}
          </Box>
        </Box>
        <Box className={classes.form_footer}>
          <Button
            onClick={handleBackClick}
            disabled={inCopyProcess}
            variant='outlined'>
            Đóng
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
