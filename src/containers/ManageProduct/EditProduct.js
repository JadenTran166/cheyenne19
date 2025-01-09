import {
  Box,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
  AppBar,
  Tabs,
  Tab,
  useMediaQuery,
  Paper,
} from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import UpdateInfo from './UpdateInfo';
import UpdateIngredients from './UpdateIngredients';
import UpdatePrice from './UpdatePrice';
import UpdatePriceWholesale from './UpdatePriceWholesale';
import axiosService from '../../config/axiosService';
import Loading from '../../components/Layout/Loading';
import { Alert } from '../../utils';
import { isBoolean } from 'lodash';
import TabPanel from 'components/TabPanel';
import useMyTheme from 'containers/MultiThemeProvider/hooks/useMyTheme';
import UpdateNutritionalIngredients from './UpdateNutritionalIngredients';
import { USER_TYPE } from 'constants/common';

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  loading: {
    position: 'relative',

    // "&:after": {
    //   content: '" "',
    //   background: "rgba(0,0,0,0.25)",
    //   position: "absolute",
    //   top: 0,
    //   left: 0,
    //   width: "100%",
    //   height: "100%",
    // },
  },
  loadingItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    background: 'rgba(0,0,0,0.15)',
  },
  hidden: { display: 'none' },
  groupHeader: {
    borderBottom: '0.5px solid #CCD6DD',
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: theme.spacing(5, 5, 0),
    background: '#ffffff',
    zIndex: 20,
  },
  info: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    '& .MuiTypography-root.MuiTypography-h6': {
      width: '100%',
    },
  },
  state: {
    minWidth: '50%',
    '& .MuiButton-label': {
      whiteSpace: 'nowrap',
    },

    '& .statusProduct': {
      textAlign: 'right',
      whiteSpace: 'nowrap',
    },

    [theme.breakpoints.up('md')]: {
      minWidth: '35%',
    },
  },
  selling: {
    color: theme.palette.success.main,
  },
  notSell: {
    color: theme.palette.error.main,
  },

  customBtn: {
    '&.MuiButton-containedPrimary': {
      backgroundColor: theme.palette.success.main,
    },
    '&.MuiButton-containedSecondary': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  },
  btnTab: {
    color: '#788288',
    fontSize: '16px',
    paddingBottom: theme.spacing(1.5, 0),
    minWidth: '150px',
    '&.active': {
      color: '#0B86D0',
      fontWeight: 'bold',
      borderBottom: '1px solid #0B86D0',
      borderRadius: '1px',
    },
  },
  groupTab: {
    position: 'relative',
  },
  tabCtn: {
    marginBottom: theme.spacing(3),
  },

  appBar: {
    boxShadow: 'none',
    background: '#ffffff',

    '& .MuiTab-root': {
      minWidth: '100px',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },

    '& .Mui-selected': {
      color: '#0B86D0',
    },

    '& .MuiTabs-indicator': {
      backgroundColor: '#0B86D0',
    },
  },
}));

export default function EditProduct(props) {
  const { mysiteData, ingredient } = props.initData;
  const { theme } = useMyTheme();

  const matcheUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles({
    matcheUpMd,
  });

  const updatePriceRef = useRef();
  const updateInfoRef = useRef();
  const [savePriceData, setSavepriceData] = useState({});
  const [savePriceListData, setSavePriceListData] = useState([]);
  const [savePriceListDataVip, setSavePriceListDataVip] = useState([]);
  const [promoWholesale, setPromoWholesale] = useState(0);
  const [promoVipWholesale, setPromoVipWholesale] = useState(0);
  const [saveInfoData, setSaveInfoData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateIngredientsRef = useRef(null);
  const updateNutritionalIngredientsRef = useRef(null);
  const updatePriceWholesale = useRef(null);

  const [isSelled, setIsSelled] = useState();

  const handleSaveUpdatePrice = async (status = null) => {
    try {
      setIsLoading(true);

      const {
        public_price,
        public_promo,
        vip_price,
        vip_promo,
        connected_promo,
        connected_price,
      } = savePriceData;

      const {
        name,
        unit,
        sub_category,
        country,
        description,
        imgs,
        instruction,
        preservation,
        hscode,
        barcode,
        weight,
      } = saveInfoData;

      const isMy =
        props.mySiteId === props.data?.product_in_site[0].imported_site;

      const result = updateInfoRef.current.handleValidateData();

      if (!result) {
        handleChangeTab(null, 0);
        return;
      }

      let data = {
        product_in_site_id: [props.data.product_in_site[0]._id],
        public_price: public_price ? public_price : '',
        vip_price: vip_price ? vip_price : '',
        connected_price: connected_price ? connected_price : '',
        unit_id: unit,
        detail_description: description,
        // ingredients: listIngredient.map((item) => item.product_id.id),
        have_ingredients: updateIngredientsRef.current.isShowIngre,
        have_nutritional_ingredients:
          updateNutritionalIngredientsRef.current.isShowIngre,
        ingredients: updateIngredientsRef.current.newData.filter(
          (item) => item.product_name
        ),
        nutritional_ingredients:
          updateNutritionalIngredientsRef.current.newData,
        name,
        sub_category,
        country,
        wholesail_discount: promoWholesale || 0,
        wholesail_discount_vip: promoVipWholesale || 0,
        instruction,
        preservation,
        hscode,
        barcode,
        weight,
      };

      if (isMy) {
        data.imgs = imgs.map(({ imageUrl }) => imageUrl);
      }

      if (
        updatePriceWholesale.current?.errorListVip?.length ||
        updatePriceWholesale.current?.errorList?.length ||
        updatePriceRef.current?.errors?.length
      ) {
        Alert.fire({
          icon: 'error',
          title: 'Cập nhật giá không thành công',
        });
        handleChangeTab(null, 2);
        return;
      }

      if (savePriceListData.length > 0) {
        data.price_list = [...savePriceListData.filter((item) => item.price)];
      }
      if (savePriceListDataVip.length > 0) {
        data.price_list_vip = [
          ...savePriceListDataVip.filter((item) => item.price),
        ];
      }

      if (isBoolean(status)) {
        data.status = status ? 'selling' : 'suspend';
      }
      let listQuery = [
        axiosService
          .patch('/product-in-site', data)
          .then((res) => {
            Alert.fire({
              icon: 'success',
              title: 'Cập nhật thành công',
            });
            props.handleRefeshData();

            if (status !== null) {
              setIsSelled(status);
            }
          })
          .catch((error) => {
            Alert.fire({
              icon: 'error',
              title:
                error.response?.data?.message ||
                'Cập nhật thất bại. Vui lòng thử lại',
            });
          }),
      ];

      if (Object.keys(savePriceData).length > 0) {
        listQuery.push(
          axiosService.patch('/update-discount', {
            product_in_site_id: [props.data.product_in_site[0]._id],
            discount_public: public_promo || 0,
            discount_vip: vip_promo || 0,
            discount_connected: connected_promo || 0,
          })
        );
      }

      await Promise.all(listQuery);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  function handleChangePromo(key, value) {
    if (key === 'promo') {
      setPromoWholesale(value);
    } else {
      setPromoVipWholesale(value);
    }
  }

  const [valueTab, setValueTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  useEffect(() => {
    if (!props.data?.product_in_site[0]._id) return;
    setIsSelled(
      props.data?.product_in_site[0].status._id === '5f9c0f708a9f141cdec6cdbb'
    );

    // getProductInSiteData();
  }, [props.data?.product_in_site[0]._id]);

  const { have_ingredients, have_nutritional_ingredients } = props.data || {};
  const ActionGroup = () => (
    <div className={classes.state}>
      <Box>
        <Box mb={0.5}>
          <Typography variant='h6' className='statusProduct'>
            Trạng thái:
            <Box
              pl={2}
              component='span'
              className={isSelled ? classes.selling : classes.notSell}>
              {isSelled ? 'Đang bán' : 'Tạm ngưng'}
            </Box>
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant='outlined'
              color='primary'
              onClick={() => {
                props.handleClose();
              }}>
              <Box component='span'>Hủy</Box>
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              disabled={false}
              onClick={() => handleSaveUpdatePrice()}>
              <Box color='secondary.main' component='span'>
                Lưu
              </Box>
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Button
              variant='contained'
              fullWidth
              color={isSelled ? 'secondary' : 'primary'}
              className={classes.customBtn}
              onClick={() => {
                handleSaveUpdatePrice(!isSelled);
              }}>
              {isSelled ? 'Tháo xuống' : 'Đăng bán'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );

  if (!props.data) return <CircularProgress color='inherit' />;
  const isMy = props.mySiteId === props.data?.product_in_site[0].imported_site;

  return (
    <Box height={1} className={isLoading ? classes.loading : ''}>
      <Box minHeight='774px' pt={matcheUpMd ? 10 : 15} px={4} pb={3}>
        <Box position='relative'>
          <div className={isLoading ? classes.loadingItem : classes.hidden}>
            <Loading />
          </div>
          <div className={classes.groupHeader}>
            <div className={classes.info}>
              <Box width={1} display='flex' justifyContent='between'>
                <Typography variant='h6'>Thông tin sản phẩm</Typography>
                {!matcheUpMd && <ActionGroup />}
              </Box>
              <AppBar
                position='static'
                color='default'
                className={classes.appBar}>
                <Tabs
                  value={valueTab}
                  onChange={handleChangeTab}
                  indicatorColor='primary'
                  textColor='primary'
                  variant='scrollable'
                  scrollButtons='auto'
                  aria-label='scrollable auto tabs example'>
                  <Tab label=' Thông tin chung' {...a11yProps(0)} />
                  <Tab label='Nguyên liệu' {...a11yProps(1)} />
                  <Tab label='Giá' {...a11yProps(2)} />
                  <Tab label='Thành phần dinh dưỡng' {...a11yProps(3)} />
                </Tabs>
              </AppBar>
            </div>
            {matcheUpMd && <ActionGroup />}
          </div>
          <TabPanel value={valueTab} index={0} isKeepMouted>
            <Grid
              container
              display='flex'
              justifyContent='space-between'
              className={classes.tabCtn}>
              <Box p={3} maxWidth='700px' margin='0 auto' clone>
                <Paper>
                  <UpdateInfo
                    initData={props.initData}
                    data={props.data}
                    handleUpdateInfo={(data) => {
                      setSaveInfoData(data);
                    }}
                    ref={updateInfoRef}
                    isMy={isMy}
                  />
                </Paper>
              </Box>
            </Grid>
          </TabPanel>
          <TabPanel value={valueTab} index={1} isKeepMouted>
            <Box p={3} maxWidth='900px' margin='0 auto' clone>
              <Paper>
                <UpdateIngredients
                  ref={updateIngredientsRef}
                  ingredients={props.data.ingredients}
                  isShowIngre={have_ingredients}
                  isMy={isMy}
                />
              </Paper>
            </Box>
          </TabPanel>
          <TabPanel value={valueTab} index={2} isKeepMouted>
            <Box p={3} maxWidth='700px' margin='0 auto' clone>
              <Paper>
                {mysiteData && (
                  <>
                    {mysiteData.site.form.key_word === USER_TYPE.RETAIL ? (
                      <UpdatePrice
                        ref={updatePriceRef}
                        data={props.data}
                        handleUpdatePrice={(data) => {
                          setSavepriceData(data);
                        }}
                      />
                    ) : (
                      <UpdatePriceWholesale
                        ref={updatePriceWholesale}
                        data={props.data}
                        handleUpdatePriceList={(data) => {
                          setSavePriceListData(data);
                        }}
                        handleUpdatePriceListVip={(data) => {
                          setSavePriceListDataVip(data);
                        }}
                        handleChangePromo={handleChangePromo}
                      />
                    )}
                  </>
                )}
              </Paper>
            </Box>
          </TabPanel>
          <TabPanel value={valueTab} index={3} isKeepMouted>
            <Box p={3} maxWidth='900px' margin='0 auto' clone>
              <Paper>
                <UpdateNutritionalIngredients
                  ref={updateNutritionalIngredientsRef}
                  nutritionalIngredients={props.data.nutritional_ingredients}
                  nutritionalIngredientsList={
                    props.initData.nutritionalIngredients
                  }
                  isShowNutriIngre={have_nutritional_ingredients}
                  isMy={isMy}
                />
                {/* nutritionalIngredients */}
              </Paper>
            </Box>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
}
