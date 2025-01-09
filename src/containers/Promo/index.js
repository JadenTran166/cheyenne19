import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import BoxDragDropImage from 'components/BoxDragDropImage';
import InputWrapper from 'components/InputWrapper';
import useStep from 'hooks/useStep';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import anyProduct from '../../assets/img/anyProducts.png';
import oneProduct from '../../assets/img/oneProduct.png';
import CommonChoiceBox from '../../components/CommonChoiceBox';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import PromoDetail from './PromoDetail';
import ChooseProduct from './ChooseProduct';
import ChooseUser from './ChooseUser';
import axiosService from 'config/axiosService';
import useUserData from 'hooks/useUserData';
import { useSelector } from 'react-redux';
import { Alert, convertArrayToObject } from 'utils';
import ProductBasic from './ProductBasic';
import { ENV_ASSETS_ENDPOINT } from 'env/local';
import OverlayLoading from 'components/Layout/OverlayLoading';
import TransitionZoom from 'components/Transition/Zoom';
import DialogWithClose from 'components/DialogWithClose';
import useCustomHistory from 'hooks/useCustomHistory';
import ChooseOneProduct from './ChooseOneProduct';
import { editorConfiguration, USER_TYPE } from 'constants/common';

const stepData = [
  {
    imgSrc: oneProduct,
    title: 'Đơn lẻ',
    decription:
      'Chương trình khuyến mãi dành cho trực tiếp 1 sản phẩm duy nhất và không cần tạo bài viết',
    alt: '1 san pham',
    status: true,
  },
  {
    imgSrc: anyProduct,
    title: 'Bài viết',
    decription:
      'Chương trình khuyến mãi dành cho nhiều sản phẩm và có kèm bài viết thông tin ',
    alt: 'nhieu san pham',
    status: true,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {},
  hr: {
    opacity: 0.24,
    border: '1px solid #000000',
  },
  typoConnected: {
    color: '#2DCF58',
  },
  typoVip: {
    color: '#f20d0d',
  },
}));

export default function Promo() {
  const { curentStep, prevStep, nextStep, jumpStep } = useStep(3);

  const classes = useStyles();
  const [dataStep1, setDataStep1] = useState(curentStep - 1);
  const [loadingImg, setLoadingImg] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [userChoose, setUserChoose] = useState([]);
  const [productChoose, setProductChoose] = useState([]);

  const [userTypeChoose, setUserTypeChoose] = useState([]);
  const { userData } = useUserData();
  const { goTo } = useCustomHistory();
  const isRetail = userData.seller_type === USER_TYPE.RETAIL;

  const [imgData, setImgData] = useState({
    imageUrl: '',
    enc: '',
    fileName: null,
  });
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isOpenChooseUser, setIsOpenChooseUser] = useState(false);
  const [isOpenChooseProduct, setIsOpenChooseProduct] = useState(false);
  const [isOpenChooseOneProduct, setIsOpenChooseOneProduct] = useState(false);

  const inputImg = useRef(null);
  const chooseUserRef = useRef(null);
  const chooseProductRef = useRef(null);
  const promoData = useRef({
    promoContent: '',
  });

  const { errors, control, handleSubmit, getValues, setError, clearErrors } =
    useForm({
      defaultValues: {
        promoTitle: '',
        content: '',
      },
      reValidateMode: 'onChange',
    });

  function handleClose(type) {
    return function () {
      switch (type) {
        case 'preview':
          setIsOpenPreview(false);
          break;
        case 'choose_user':
          setIsOpenChooseUser(false);
          break;

        case 'choose_product':
          setIsOpenChooseProduct(false);
          break;
        case 'choose_one_product':
          setIsOpenChooseOneProduct(false);
          break;

        default:
          break;
      }
    };
  }

  function handleNextStep1() {
    if (dataStep1 === 1) {
      jumpStep(2);
    } else {
      jumpStep(3);
    }
  }
  function handleBoxImgClick() {
    inputImg.current.click();
  }
  function onUpdateAvatar(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.fileName = file.name;
    reader.onloadstart = () => {
      setLoadingImg(true);
    };
    reader.onloadend = (readerEvt) => {
      var base64result = reader.result.split(',')[1];
      setLoadingImg(false);
      setImgData({
        imageUrl: reader.result,
        enc: base64result,
        fileName: readerEvt.target.fileName,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  async function onSubmit({ promoTitle }) {
    let isValidate = true;

    let isContent = dataStep1 === 1;
    const data = {
      siteId: userData?.site?._id,
      title: promoTitle || '',
      content: isContent ? promoData.current?.promoContent : '',
      banners: isContent && imgData?.imageUrl ? [imgData?.imageUrl] : [],
      type: isContent ? 'content' : 'direct',
      targetClientType: userTypeChoose.filter((item) => item !== 'all'),
      targetUsers: [],
      targetSites: [],
      productInSites: [],
    };

    if (isContent) {
      if (!promoTitle) {
        setError(
          'promoTitle',
          { message: 'Vui lòng nhập tựa đề.' },
          { shouldFocus: true }
        );
        document.querySelector("input[name='promoTitle']").scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        isValidate = false;
      }
      if (!data.content) {
        setError(
          'content',
          { message: 'Vui lòng nhập nội dung.' },
          { shouldFocus: true }
        );
        if (!isValidate) {
          document.querySelector("input[name='promoTitle']").scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
        isValidate = false;
      }
    }

    if (!isValidate) return;

    if (productChoose.length) {
      data.productInSites = productChoose.map(
        (item) => item.product_in_site[0]._id
      );
    }

    if (isRetail) {
      data.targetUsers = userChoose.map((item) => item.user?._id);
    } else {
      data.targetSites = userChoose.map((item) => item.request_site?._id);
    }

    // direct required targetUsers or targetSites

    if (!isContent) {
      if (!data.targetUsers.length && !data.targetSites.length) {
        return Alert.fire({
          title: 'Vui lòng chọn đối tượng nhận thông báo khuyến mãi này.',
          icon: 'error',
        }).then(() => {
          handleShowModal('choose_user')();
        });
      }

      if (!data.productInSites.length) {
        return Alert.fire({
          title: 'Vui lòng chọn 1 sản phẩm bạn muốn khuyến mãi.',
          icon: 'error',
        }).then(() => {
          handleShowModal('choose_one_product')();
        });
      }

      const listConnected = [];
      const listVip = [];

      const listTypeUserChoose = new Set();
      userChoose.forEach((u) => {
        if (u.is_vip) {
          listTypeUserChoose.add('vip');
          listVip.push(u);
        } else {
          if (u.status === 'accepted') {
            listTypeUserChoose.add('connected');
            listConnected.push(u);
          }
        }
      });
      const hasConnected = listTypeUserChoose.has('connected');
      const hasVip = listTypeUserChoose.has('vip');
      async function showAlert(type) {
        const productName = productChoose[0]?.name || 'A';
        const userType =
          type === 'vip'
            ? '<b style="color: #f20d0d">Khách hàng vip</b>'
            : '<b style="color: #2DCF58">Khách hàng đã liên kết</b>';
        const listUser = type === 'vip' ? listVip : listConnected;
        let contentHtml = `<div>
        <span>Sản phẩm <b>"${productName}"</b> không có giảm giá dành cho <b>${userType}</b> 
        nên ${
          listUser.length > 1 ? 'những' : ''
        } đối tượng này sẽ không nhận được thông báo khuyến mãi: </span>
        <ul style="text-align:left;width: 50%; margin: 10px auto 0;">
          ${listUser
            .map(({ user, request_site }) => {
              const name = isRetail ? user?.name : request_site?.name;
              return `<li>${name || '---'}</li>`;
            })
            .join('')}
        </ul>
        </div>`;

        await Alert.fire({
          icon: 'info',
          html: contentHtml,
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonText: 'Tiếp tục',
          cancelButtonText: `Hủy`,
          timer: 60 * 5 * 1000,
        }).then((result) => {
          if (!result.isConfirmed) {
            return Promise.reject();
          } else {
            let filterUserChoose = userChoose.filter(({ is_vip, status }) => {
              if (type === 'vip' && is_vip) {
                return false;
              }

              if (type === 'connected' && status === 'accepted' && !is_vip) {
                return false;
              }

              return true;
            });

            if (isRetail) {
              data.targetUsers = filterUserChoose.map((item) => item.user?._id);
            } else {
              data.targetSites = filterUserChoose.map(
                (item) => item.request_site?._id
              );
            }

            if (!data.targetUsers.length && !data.targetSites.length) {
              return Alert.fire({
                title: 'Vui lòng chọn đối tượng nhận thông báo khuyến mãi này.',
                icon: 'error',
              }).then(() => {
                handleShowModal('choose_user')();
                return Promise.reject();
              });
            }
          }
        });
      }

      const {
        connected_price,
        vip_price,
        wholesail_discount,
        wholesail_discount_vip,
      } = productChoose[0]?.product_in_site[0] || {};

      try {
        if (isRetail) {
          if (hasConnected && !connected_price.discount) {
            await showAlert('connected');
          }

          if (hasVip && !vip_price.discount) {
            await showAlert('vip');
          }
        } else {
          if (hasConnected && !wholesail_discount) {
            await showAlert('connected');
          }

          if (hasVip && !wholesail_discount_vip) {
            await showAlert('vip');
          }
        }
      } catch (error) {
        console.error(error);
        return;
      }
    }

    setLoadingSubmit(true);

    axiosService
      .post('/promotion', data)
      .then((res) => {
        setLoadingSubmit(false);
        Alert.fire({
          icon: 'success',
          title: 'Tạo bài viết khuyến mãi thành công.',
          text: 'Bạn muốn tiếp tục tạo bài viết khuyến mãi ?',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonText: 'Tiếp tục',
          cancelButtonText: `Hủy`,
          timer: 60 * 5 * 1000,
        }).then((result) => {
          if (result.isConfirmed) {
            handleClearData();
          } else {
            goTo('home');
          }
        });
      })
      .catch((error) => {
        setLoadingSubmit(false);
        Alert.fire({
          title:
            error.response?.data?.error ||
            'Tạo bài viết khuyến mãi không thành công.',
          icon: 'error',
        });
      });
  }

  function handleClearData() {
    jumpStep(1);
    chooseUserRef.current.reMoutedData();
    chooseProductRef.current.reMoutedData();
  }

  function handleCkChange(event, editor) {
    const data = editor.getData();
    if (data && errors.content?.message) {
      clearErrors('content');
    }

    promoData.current.promoContent = data;
  }

  function handleShowModal(type) {
    return function () {
      switch (type) {
        case 'preview':
          setIsOpenPreview(true);
          handlePreview();
          break;
        case 'choose_user':
          setIsOpenChooseUser(true);
          break;

        case 'choose_product':
          setIsOpenChooseProduct(true);
          break;
        case 'choose_one_product':
          setIsOpenChooseOneProduct(true);
          break;

        default:
          break;
      }
    };
  }

  function handlePreview() {
    const promoTitle = getValues('promoTitle');
    promoData.current = {
      ...promoData.current,
      promoTitle,
      src: imgData.imageUrl,
      alt: 'banner_promo_detail',
      createAt: new Date(),
    };
  }

  const countVip = userChoose.reduce((total, item) => {
    if (item.is_vip) {
      return total + 1;
    }
    return total;
  }, 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display='flex' justifyContent='center' pt={6} pb={4}>
        {curentStep === 1 && (
          <Box minHeight='536px' width={1} maxWidth='355px'>
            <Typography variant='h6'>Loại chương trình khuyến mãi:</Typography>

            <Box display='flex' my={4}>
              {stepData.map((item, index) => (
                <Box
                  mr={index === 0 ? 1 : 0}
                  key={index}
                  width={1}
                  onClick={() => {
                    if (item.status) setDataStep1(index);
                  }}>
                  <CommonChoiceBox
                    imgSrc={item.imgSrc}
                    alt={item.alt}
                    title={item.title}
                    description={item.decription}
                    active={dataStep1 === index}
                    disabled={!item.status}
                  />
                </Box>
              ))}
            </Box>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              disabled={dataStep1 === null}
              onClick={handleNextStep1}>
              <Box py={1}>Tiếp theo</Box>
            </Button>
          </Box>
        )}
        {curentStep === 2 && (
          <Box minHeight='536px' width={1} maxWidth='790px'>
            <OverlayLoading opacity={0.7} isLoading={loadingSubmit} isLight>
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='h6'>Tạo bài viết khuyến mãi</Typography>
              </Box>
              <Box display='flex' my={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      <OverlayLoading
                        opacity={0.7}
                        isLoading={loadingImg}
                        isLight>
                        <Box display='flex' justifyContent='center'>
                          <BoxDragDropImage
                            width='100%'
                            height='225px'
                            isReplaceError
                            imgData={imgData}
                            onClick={handleBoxImgClick}
                          />
                        </Box>
                      </OverlayLoading>
                      {/* {errors.includes('image') && (
                    <Box mt={1}>
                      <Typography variant='subtitle1' color='error'>
                        {imgData.length < 1
                          ? 'Vui lòng chọn ít nhất 1 ảnh cho sản phẩm!'
                          : 'Tối đa 6 ảnh cho sản phẩm!'}
                      </Typography>
                    </Box>
                  )} */}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <InputWrapper
                helperText={errors.promoTitle && errors.promoTitle.message}
                error={!!errors.promoTitle || undefined}
                variant='outlined'
                // margin='dense'
                label='Tiêu đề'
                type='text'
                fullWidth
                name='promoTitle'
                control={control}
              />

              <Box px={4} my={3}>
                <hr className={classes.hr} />
              </Box>
              <Box>
                <CKEditor
                  config={editorConfiguration}
                  editor={Editor}
                  data=''
                  onChange={handleCkChange}
                />
                {errors.content && (
                  <Typography variant='caption' color='error'>
                    {errors.content.message}
                  </Typography>
                )}
              </Box>

              {userTypeChoose.length > 0 && (
                <Box mt={2} p={2} border='1px solid #c4c4c4' clone>
                  <Paper elevation={0}>
                    <Typography variant='body1' gutterBottom>
                      <Box fontWeight='bold' component='span'>
                        Đối tượng khuyến mãi đã chọn
                      </Box>
                    </Typography>
                    <Grid container alignItems='center' spacing={2}>
                      {userTypeChoose.includes('all') ? (
                        <Grid item sm={3} key={`user_type_all`}>
                          <Typography variant='body1'>Tất cả</Typography>
                        </Grid>
                      ) : (
                        userTypeChoose.map((userType, index) => {
                          if (userType === 'all') return '';
                          let displayText = '';
                          switch (userType) {
                            case 'vip':
                              displayText = 'Khách vip';
                              break;
                            case 'connected':
                              displayText = 'Khách đã liên kết';
                              break;
                            default:
                              displayText = 'Khách lạ';
                              break;
                          }

                          return (
                            <Grid item sm={3} key={`user_type_${index}`}>
                              <Typography variant='body1'>
                                {displayText}
                              </Typography>
                            </Grid>
                          );
                        })
                      )}
                    </Grid>
                  </Paper>
                </Box>
              )}

              {userChoose?.length > 0 && (
                <Box mt={2} p={2} border='1px solid #c4c4c4' clone>
                  <Paper elevation={0}>
                    <Typography variant='body1' gutterBottom>
                      <Box fontWeight='bold' component='span'>
                        Danh sách khách hàng nhận được thông báo
                      </Box>
                    </Typography>
                    <Grid container>
                      {countVip > 0 && (
                        <Grid item sm={6}>
                          <Typography
                            className={classes.typoVip}
                            variant='body1'
                            gutterBottom>
                            <Box fontWeight='bold' component='span'>
                              Khách hàng vip
                            </Box>
                          </Typography>
                          <Box>
                            {userChoose.map(
                              (user, index) =>
                                user.is_vip && (
                                  <Typography
                                    gutterBottom
                                    key={`user_vip_choose$_${index}`}>
                                    {' '}
                                    -{' '}
                                    {isRetail
                                      ? user.user?.name
                                      : user.request_site?.name}
                                  </Typography>
                                )
                            )}
                          </Box>
                        </Grid>
                      )}
                      {userChoose?.length - countVip > 0 && (
                        <Grid item sm={6}>
                          <Typography
                            className={classes.typoConnected}
                            variant='body1'
                            gutterBottom>
                            <Box fontWeight='bold' component='span'>
                              Khách hàng đã liên kết
                            </Box>
                          </Typography>
                          <Box>
                            {userChoose.map(
                              (user, index) =>
                                !user.is_vip &&
                                user.status === 'accepted' && (
                                  <Typography
                                    gutterBottom
                                    key={`user_choose$_${index}`}>
                                    {' '}
                                    -{' '}
                                    {isRetail
                                      ? user.user?.name
                                      : user.request_site?.name}
                                  </Typography>
                                )
                            )}
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Box>
              )}

              {productChoose.length > 0 && (
                <Box mt={2} p={2} border='1px solid #c4c4c4' clone>
                  <Paper elevation={0}>
                    <Typography variant='body1' gutterBottom>
                      <Box fontWeight='bold' component='span'>
                        Danh sách sản phẩm khuyến mãi đã chọn
                      </Box>
                    </Typography>
                    <Grid container alignItems='center' spacing={2}>
                      {productChoose.map((product, index) => {
                        const { name, imgs } = product;
                        return (
                          <Grid
                            item
                            xs={6}
                            sm={2}
                            key={`product_choose_${index}`}>
                            <ProductBasic
                              src={`${ENV_ASSETS_ENDPOINT}${imgs[0]?.link}`}
                              alt={imgs[0]?.alt}
                              name={name}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Paper>
                </Box>
              )}

              <Box mt={2}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      variant='outlined'
                      color='primary'
                      fullWidth
                      onClick={() => {
                        prevStep();
                        handleClearData();
                      }}>
                      Quay lại
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant='outlined'
                      color='primary'
                      fullWidth
                      onClick={handleShowModal('choose_user')}>
                      Chọn đối tượng
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant='outlined'
                      color='primary'
                      fullWidth
                      onClick={handleShowModal('choose_product')}>
                      Chọn sản phẩm
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant='outlined'
                      color='primary'
                      fullWidth
                      onClick={handleShowModal('preview')}>
                      Xem trước
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant='contained'
                      color='primary'
                      fullWidth
                      type='submit'>
                      Đăng bài
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </OverlayLoading>
          </Box>
        )}

        {curentStep === 3 && (
          <Box minHeight='536px' width={1} maxWidth='790px'>
            <OverlayLoading opacity={0.7} isLoading={loadingSubmit} isLight>
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='h6' gutterBottom>
                  Tạo thông báo khuyến mãi
                </Typography>
              </Box>

              {userTypeChoose.length > 0 && (
                <Box mt={2} p={2} border='1px solid #c4c4c4' clone>
                  <Paper elevation={0}>
                    <Typography variant='body1' gutterBottom>
                      <Box fontWeight='bold' component='span'>
                        Đối tượng khuyến mãi đã chọn
                      </Box>
                    </Typography>
                    <Grid container alignItems='center' spacing={2}>
                      {userTypeChoose.includes('all') ? (
                        <Grid item sm={3} key={`user_type_all`}>
                          <Typography variant='body1'>Tất cả</Typography>
                        </Grid>
                      ) : (
                        userTypeChoose.map((userType, index) => {
                          if (userType === 'all') return '';
                          let displayText = '';
                          switch (userType) {
                            case 'vip':
                              displayText = 'Khách vip';
                              break;
                            case 'connected':
                              displayText = 'Khách đã liên kết';
                              break;
                            default:
                              displayText = 'Khách lạ';
                              break;
                          }

                          return (
                            <Grid item sm={3} key={`user_type_${index}`}>
                              <Typography variant='body1'>
                                {displayText}
                              </Typography>
                            </Grid>
                          );
                        })
                      )}
                    </Grid>
                  </Paper>
                </Box>
              )}

              {userChoose?.length > 0 && (
                <Box mt={2} p={2} border='1px solid #c4c4c4' clone>
                  <Paper elevation={0}>
                    <Typography variant='body1' gutterBottom>
                      <Box fontWeight='bold' component='span'>
                        Danh sách khách hàng nhận được thông báo
                      </Box>
                    </Typography>
                    <Grid container>
                      {countVip > 0 && (
                        <Grid item sm={6}>
                          <Typography
                            className={classes.typoVip}
                            variant='body1'
                            gutterBottom>
                            <Box fontWeight='bold' component='span'>
                              Khách hàng vip
                            </Box>
                          </Typography>
                          <Box>
                            {userChoose.map(
                              (user, index) =>
                                user.is_vip && (
                                  <Typography
                                    gutterBottom
                                    key={`user_vip_choose$_${index}`}>
                                    {' '}
                                    -{' '}
                                    {isRetail
                                      ? user.user?.name
                                      : user.request_site?.name}
                                  </Typography>
                                )
                            )}
                          </Box>
                        </Grid>
                      )}
                      {userChoose?.length - countVip > 0 && (
                        <Grid item sm={6}>
                          <Typography
                            className={classes.typoConnected}
                            variant='body1'
                            gutterBottom>
                            <Box fontWeight='bold' component='span'>
                              Khách hàng đã liên kết
                            </Box>
                          </Typography>
                          <Box>
                            {userChoose.map(
                              (user, index) =>
                                !user.is_vip &&
                                user.status === 'accepted' && (
                                  <Typography
                                    gutterBottom
                                    key={`user_choose$_${index}`}>
                                    {' '}
                                    -{' '}
                                    {isRetail
                                      ? user.user?.name
                                      : user.request_site?.name}
                                  </Typography>
                                )
                            )}
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Box>
              )}

              {productChoose.length > 0 && (
                <Box mt={2} p={2} border='1px solid #c4c4c4' clone>
                  <Paper elevation={0}>
                    <Typography variant='body1' gutterBottom>
                      <Box fontWeight='bold' component='span'>
                        Danh sách sản phẩm khuyến mãi đã chọn
                      </Box>
                    </Typography>
                    <Grid container alignItems='center' spacing={2}>
                      {productChoose.map((product, index) => {
                        const { name, imgs } = product;
                        return (
                          <Grid
                            item
                            xs={6}
                            sm={2}
                            key={`product_choose_${index}`}>
                            <ProductBasic
                              src={`${ENV_ASSETS_ENDPOINT}${imgs[0]?.link}`}
                              alt={imgs[0]?.alt}
                              name={name}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Paper>
                </Box>
              )}

              <Box mt={2}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      variant='outlined'
                      color='primary'
                      fullWidth
                      onClick={() => {
                        prevStep();
                        handleClearData();
                      }}>
                      Quay lại
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant='outlined'
                      color='primary'
                      fullWidth
                      onClick={handleShowModal('choose_user')}>
                      Chọn đối tượng
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant='outlined'
                      color='primary'
                      fullWidth
                      onClick={handleShowModal('choose_one_product')}>
                      Chọn sản phẩm
                    </Button>
                  </Grid>
                  {/* <Grid item xs={6}>
                  <Button
                    variant='outlined'
                    color='primary'
                    fullWidth
                    onClick={handleShowModal('preview')}>
                    Xem trước
                  </Button>
                </Grid> */}
                  <Grid item xs={6}>
                    <Button
                      variant='contained'
                      color='primary'
                      fullWidth
                      type='submit'>
                      Gửi khuyến mãi
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </OverlayLoading>
          </Box>
        )}

        <input
          ref={inputImg}
          type='file'
          style={{ display: 'none' }}
          onChange={onUpdateAvatar}
          accept='image/*'
        />
      </Box>

      {/* Modal review */}
      <DialogWithClose
        onClose={handleClose('preview')}
        aria-labelledby='modal preview'
        maxWidth='lg'
        fullWidth
        isOpen={isOpenPreview}>
        <PromoDetail {...promoData.current} />
      </DialogWithClose>

      {/* Modal choose user */}
      <DialogWithClose
        onClose={handleClose('choose_user')}
        aria-labelledby='modal choose user'
        maxWidth='lg'
        fullWidth
        keepMounted
        isOpen={isOpenChooseUser}>
        <ChooseUser
          ref={chooseUserRef}
          setUserChoose={setUserChoose}
          setUserTypeChoose={setUserTypeChoose}
          isRetail={isRetail}
        />
      </DialogWithClose>

      {/* Modal choose products */}
      <DialogWithClose
        onClose={handleClose('choose_product')}
        aria-labelledby='modal choose product'
        maxWidth='lg'
        fullWidth
        keepMounted
        isOpen={isOpenChooseProduct}
        TransitionComponent={TransitionZoom}>
        <ChooseProduct
          ref={chooseProductRef}
          setProductChoose={setProductChoose}
          isRetail={isRetail}
        />
      </DialogWithClose>

      {/* Modal choose one product */}
      <DialogWithClose
        onClose={handleClose('choose_one_product')}
        aria-labelledby='modal choose one product'
        maxWidth='lg'
        fullWidth
        keepMounted
        isOpen={isOpenChooseOneProduct}
        TransitionComponent={TransitionZoom}>
        <ChooseOneProduct
          ref={chooseProductRef}
          setProductChoose={setProductChoose}
          isRetail={isRetail}
          handleClose={handleClose('choose_one_product')}
        />
      </DialogWithClose>
    </form>
  );
}
