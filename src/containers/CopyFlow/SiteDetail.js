import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import axiosService from 'config/axiosService';
import { ASSETS_ENDPOINT, replaceImg } from 'constants/common';
import { ENV_ASSETS_ENDPOINT, ENV_GERMANY_ENDPOINT } from 'env/local';
import useUserData from 'hooks/useUserData';
import { find } from 'lodash';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  vipColor: {
    color: theme.palette.secondary.main,
    marginLeft: 5,
    fontSize: 16,
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  rootCard: {
    borderRadius: 0,
    '& .MuiPaper-rounded': {
      borderRadius: 0,
    },
    '& .MuiCardActionArea-focusHighlight': {
      backgroundColor: '#FFFFFF',
    },
    '&:hover': {
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)',
    },
    boxShadow: theme.shadows[0],
    backgroundColor: '#FFFFFF',
    textAlign: 'left',
    height: '100%',
    // margin: theme.spacing(0.5, 0.5, 0.5, 0.5),
  },
  cardActionDetail: {
    height: '100%',
    borderRadius: 'none',
  },

  mediaCard: {
    // paddingTop: theme.spacing(20),
    height: '140px',
    backgroundSize: 'cover',
  },
  mediaCard2: {
    // paddingTop: theme.spacing(20),
    height: '140px',
    maxWidth: '100%',
    width: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  },
  cardContent: {},
  linkURL: {
    color: '#000000',
  },
  nameProduct: {
    color: '#9496A5',
    minWidth: '100%',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 2,
    maxHeight: 100,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  minWidth100: {
    minWidth: '100%',
  },
  itemBox: {
    padding: theme.spacing(0, 2.75, 2.75, 2.75),
  },
}));
export default function SiteDetail(props) {
  const classes = useStyles();
  const { selectedSite, handleUnlinkOnClick } = props;
  const [productInSite, setProductInSite] = useState(
    selectedSite?.copied_products_raw || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUserData();

  useEffect(() => {
    if (selectedSite) {
      setProductInSite(selectedSite?.copied_products_raw || []);
      // axiosService
      //   .get('/product-in-site', { site: selectedSite?.id })
      //   .then((res) => {
      //     setProductInSite(res?.data?.products || []);
      //     setIsLoading(false);
      //   });
    }
  }, [selectedSite]);

  return (
    <Box component={Paper} className={classes.root}>
      {selectedSite && (
        <>
          <Box
            display='flex'
            p={3}
            style={{
              borderBottom: '1px solid #efefef',
            }}
            mb={3}>
            <Box display='flex'>
              <Box
                className={classes.imageWrapper}
                border={1}
                borderColor='#efefef'
                width={100}
                mr={2}>
                <img
                  draggable='false'
                  className={classes.img}
                  src={`${ENV_ASSETS_ENDPOINT}${selectedSite?.logo}`}
                  alt={'site'}
                />
              </Box>
              <Box color='primary.main'>
                <Box fontSize={20} fontWeight='bold' mb={2}>
                  {selectedSite?.name}
                  <span
                    className={selectedSite.isVip ? classes.vipColor : {}}
                    style={
                      selectedSite.isVip
                        ? {}
                        : {
                            color: selectedSite.connectedDate
                              ? '#2DCF58'
                              : '#f20d0d',
                            marginLeft: 5,
                            fontSize: 16,
                          }
                    }>
                    (
                    {selectedSite.connectedDate
                      ? selectedSite.isVip
                        ? 'Khách Hàng Vip'
                        : 'Đã Liên Kết'
                      : 'Chưa liên kết'}
                    )
                  </span>
                </Box>
                <Box fontSize={16}>
                  Công ty cung cấp:{' '}
                  <Box fontWeight='bold' component='span'>
                    {selectedSite?.origin}
                  </Box>
                </Box>
                <Box fontSize={16}>
                  Ngày liên kết:{' '}
                  <Box fontWeight='bold' component='span'>
                    {selectedSite?.connectedDate}
                  </Box>
                </Box>
                <Box fontSize={16}>
                  Sản phầm copy:{' '}
                  <Box fontWeight='bold' component='span'>
                    {selectedSite?.totalCopiedProducts}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className={classes.button}>
              <Button
                variant='outlined'
                color='primary'
                style={{ marginBottom: 20 }}
                onClick={() => {
                  window.location.href = `${ENV_GERMANY_ENDPOINT}site/${selectedSite?.id}`;
                }}>
                Xem công ty
              </Button>
              {userData?.site?.id === selectedSite.imported_site._id &&
                selectedSite.connectedDate && (
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      handleUnlinkOnClick(selectedSite.id, selectedSite.name);
                    }}>
                    Hủy liên kết
                  </Button>
                )}
            </Box>
          </Box>
          <Grid container className={classes.itemBox}>
            {isLoading ? (
              <Box
                width='100%'
                height='300px'
                display='flex'
                alignItems='center'
                justifyContent='center'>
                <CircularProgress />
              </Box>
            ) : productInSite.length > 0 ? (
              productInSite.map((productId, index) => {
                const element = find(selectedSite?.copied_products, (item) => item?._id === productId)
                let image = find(
                  selectedSite?.product_images,
                  (data) => data?.product_id === element?._id
                );
                return (
                  <Grid item lg={2} xl={2} md={2} sm={2} xs={2} key={index}>
                    <Card className={classes.rootCard}>
                      <CardActionArea className={classes.cardActionDetail}>
                        <img
                          alt='Image'
                          className={classes.mediaCard2}
                          src={
                            image && image?.link
                              ? ASSETS_ENDPOINT + image?.link
                              : ''
                          }
                          onError={replaceImg}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography
                            gutterBottom
                            className={classes.nameProduct}>
                            {element?.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Typography align='center'>
                Không có sản phẩm nào để hiển thị
              </Typography>
            )}
          </Grid>
          {productInSite?.length > 0 ? (
            <Box justifyContent='center' display='flex' p={3}>
              <Grid container className={classes.itemBox} spacing={1}></Grid>
            </Box>
          ) : (
            <Box justifyContent='center' display='flex' p={3}>
              Không có sản phẩm nào
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
