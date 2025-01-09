import {
  Box,
  Button,
  Grid,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { Autocomplete } from '@material-ui/lab';
import TabScrollVerticalNavigate from 'components/newCreateProduct/component/TabScrollNavigate';
import FirstStepCreateProduct from 'components/newCreateProduct/FirstStepComponent';
import { USER_TYPE } from 'constants/common';
import useUserData from 'hooks/useUserData';
import { isEmpty, remove } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Element } from 'react-scroll';
import {
  clearProductData,
  updateProductCate,
  updateProductInfo,
  updateProductName,
  updateProductSubCate,
} from 'slice/productSlice';
import Swal from 'sweetalert2';
import boxImg from '../../assets/icon/box.svg';
import truckImg from '../../assets/icon/truck.svg';
import BoxDragDropImage from '../../components/BoxDragDropImage';
import axiosService from '../../config/axiosService';
import { listRouteByKey } from '../../config/configureRoute';
import { ENV_API_ENDPOINT } from '../../env/local';
import useQuery from '../../hooks/useQuery';
import useStep from '../../hooks/useStep';
import { convertArrayToObject } from '../../utils';
import UpdateIngredients from './UpdateIngredients';
import UpdateNutritional from './UpdateNutritional';
import UpdatePrice from './UpdatePrice';

const stepData = [
  {
    imgSrc: boxImg,
    title: 'Chính bạn',
    decription: 'Bạn là nhà sản xuất và muốn tạo sản phẩm của công ty mình.',
    alt: 'san pham cua ban',
    status: true,
  },
  {
    imgSrc: truckImg,
    title: 'Nơi khác',
    decription:
      'Bạn muốn nhập sản phẩm từ công ty khác nhưng công ty đó chưa có trên hệ thống hoặc sản phẩm  bạn muốn nhập chưa có trên hệ thống. ',
    alt: 'san pham noi khac',
    status: true,
  },
];

const productNameItem = {
  key: 'name',
  label: 'Tên sản phẩm',
  type: 'text',
  helperText: 'Vui lòng nhập tên sản phẩm.',
  required: true,
  col: 12,
};

const inputList = [
  // {
  //   key: 'name',
  //   label: 'Tên sản phẩm',
  //   type: 'text',
  //   helperText: 'Vui lòng nhập tên sản phẩm.',
  //   required: true,
  //   col: 12,
  // },
  {
    key: 'country',
    label: 'Quốc gia',
    type: 'select',
    dataKey: 'country',
    helperText: 'Vui lòng chọn quốc gia.',
    required: true,
    col: 6,
  },
  {
    key: 'unit',
    label: 'Đơn vị',
    type: 'select',
    dataKey: 'unitData',
    helperText: 'Vui lòng chọn đơn vị.',
    required: true,
    col: 6,
  },
  {
    key: 'quantity',
    label: 'Số lượng',
    type: 'number',
    helperText: 'Vui lòng nhập số lượng sản phẩm lớn hơn 0.',
    required: true,
  },
  {
    key: 'hscode',
    label: 'Mã số biểu thuế',
    type: 'text',
    helperText: '',
    required: false,
  },
  {
    key: 'barcode',
    label: 'Mã vạch',
    type: 'text',
    helperText: '',
    required: false,
  },
  {
    key: 'weight',
    label: 'Dung tích/Khối lượng',
    type: 'text',
    helperText: '',
    required: false,
  },
  {
    key: 'instruction',
    label: 'Hướng dẫn sử dụng',
    type: 'textarea',
    helperText: '',
    required: false,
    multiline: true,
    rows: 3,
  },
  {
    key: 'preservation',
    label: 'Cách bảo quản',
    type: 'textarea',
    helperText: '',
    required: false,
    multiline: true,
    rows: 3,
  },
  {
    key: 'description',
    label: 'Mô tả sản phẩm',
    type: 'textarea',
    helperText: '',
    required: false,
    col: 12,
    multiline: true,
    rows: 5,
  },
];

const useStyles = makeStyles((theme) => ({
  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  section: {
    marginBottom: '1.5rem',
  },
  fieldWrapper: {
    marginBottom: '1.5rem',
  },
  selectedItem: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    marginRight: '1.5rem',
  },
  editIcon: {
    fill: theme.palette.grey[500],
    '&:hover': {
      cursor: 'pointer',
      fill: theme.palette.primary.main,
    },
  },
  tableWrapper: {
    backgroundColor: theme.palette.grey[200],
    width: '100%',
    minHeight: 250,
  },
  columnFormat: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewItemWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px dashed ${theme.palette.primary.light}`,
    padding: '0.5rem',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.grey[300],
    },
  },
  addNewItem: {
    color: theme.palette.primary.light,
  },
  expireField: {
    display: 'flex',
  },
}));

export default function CreateProduct() {
  const classes = useStyles();

  const history = useHistory();
  const dispatch = useDispatch();

  const { userData } = useUserData();
  const isRetail = userData.seller_type === USER_TYPE.RETAIL;

  const createProductData = useSelector((state) => state.product);
  const {
    productName,
    productCate,
    productSubCate,
    ingredients,
    nutritional_ingredients,
    have_ingredients,
    have_nutritional_ingredients,
  } = createProductData;

  const { curentStep, prevStep, nextStep, jumpStep } = useStep(8);
  const [dataStep1, setDataStep1] = useState(() => {
    // const st1 = query.get('st1');
    // if (['0', '1'].includes(st1)) return +st1;
    // return null;
  });
  const ingredientRef = useRef(null);
  const priceRef = useRef(null);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [loadingImg, setLoadingImg] = useState(false);
  const [imgData, setImgData] = useState([]);

  const [initData, setInitData] = useState({
    country: [],
    category: [],
    sub_category: [],
    unitData: [],
    ingredient: [],
  });
  const [formData, setFormData] = useState({
    country: '',
    description: '',
    unit: '',
    hscode: '',
    barcode: '',
    instruction: '',
    preservation: '',
    weight: '',
    expire_date: 0,
    expire_date_unit: '',
    quantity: 0,
  });

  const resetData = () => {
    dispatch(updateProductName(''));
    dispatch(updateProductCate({}));
    dispatch(updateProductSubCate({}));
    setFormData({
      country: '',
      description: '',
      unit: '',
      hscode: '',
      barcode: '',
      instruction: '',
      preservation: '',
      weight: '',
      expire_date: 0,
      expire_date_unit: '',
      quantity: 0,
    })
  }

  const [errorValidate, setErrorValidate] = useState({});
  const inputImg = useRef(null);

  function handleBoxImgClick() {
    inputImg.current.click();
  }

  function clearData() {
    setImgData([]);
    setErrors([]);
    setFormData({
      country: '',
      description: '',
      unit: '',
      hscode: '',
      barcode: '',
      instruction: '',
      preservation: '',
      weight: '',
      expire_date: 0,
      expire_date_unit: '',
      quantity: 0,
    });
    dispatch(clearProductData());
  }

  const formatWholeSalePrice = (priceData) => {
    const { newPriceList, newPriceListVip } = priceData;
    let price_list = [];
    if (newPriceList && newPriceList.length > 0) {
      newPriceList.map((item) => {
        if (item?.quantity && item?.price) {
          price_list.push({
            quantity: item?.quantity,
            price: item?.price,
          });
        }
      });
    }

    let price_list_vip = [];
    if (newPriceListVip && newPriceListVip.length > 0) {
      newPriceListVip.map((item) => {
        if (item?.quantity && item?.price) {
          price_list_vip.push({
            quantity: item.quantity,
            price: item.price,
          });
        }
      });
    }
    return { price_list, price_list_vip };
  };

  function handleFinishCreate() {
    if (
      !validateAllForm() ||
      priceRef?.current?.newData?.errorList?.length > 0 ||
      priceRef?.current?.newData?.errorListVip?.length > 0
    ) {
      return;
    } else {
      const {
        unit,
        hscode,
        barcode,
        instruction,
        country,
        preservation,
        weight,
        description,
        expire_date,
        expire_date_unit,
        quantity,
      } = formData;
      const optionPrice = isRetail
        ? {
            ...priceRef.current.newData,
          }
        : {
            ...formatWholeSalePrice(priceRef.current.newData),
          };
      const optionExpireDate = expire_date
        ? {
            expire_date: {
              value: parseInt(expire_date),
              unit: expire_date_unit,
            },
          }
        : {};

      axiosService
        .post('/product', {
          self_create: true,
          temp_site: false,
          unit,
          hscode,
          barcode,
          instruction,
          preservation,
          short_description: '',
          weight,
          quantity,
          ...optionExpireDate,
          detail_description: description,
          imgs: imgData.map(({ imageUrl }) => imageUrl),
          have_ingredients,
          ingredients: have_ingredients ? ingredientRef.current.newData : [],
          have_nutritional_ingredients,
          nutritional_ingredients: have_nutritional_ingredients
            ? nutritional_ingredients
            : [],
          name: productName,
          sub_category: productSubCate._id,
          country,
          ...optionPrice,
        })
        .then((res) => {
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Tạo sản phẩm thành công',
              text: 'Bạn muốn tiếp tục tạo sản phẩm ?',
              reverseButtons: true,
              showCancelButton: true,
              confirmButtonText: 'Tiếp tục',
              cancelButtonText: `Vào kho sản phẩm`,
            }).then((result) => {
              resetData()
              if (result.isConfirmed) {
                jumpStep(1);
              } else {
                history.push(listRouteByKey['manage_product'].path);
              }
              clearData();
            });
          }, 300);
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: error?.response?.data?.message || 'Tạo sản phẩm thất bại',
            showConfirmButton: false,
            timer: 2000,
          });
        });
    }
  }

  const getInitData = async () => {
    try {
      const requestCategory = axiosService.get(`${ENV_API_ENDPOINT}/category`);
      const requestCountry = axiosService.get(`${ENV_API_ENDPOINT}/country`);
      const requestUnit = axiosService.get(`${ENV_API_ENDPOINT}/unit`);
      const requestDefaultNutritional = axiosService.get(
        `${ENV_API_ENDPOINT}/nutritional_ingredients`
      );

      const [categoryData, countryData, unitData] = await Promise.all([
        requestCategory.then((res) => res.data),
        requestCountry.then((res) => res.data),
        requestUnit.then((res) => res.data),
        requestDefaultNutritional.then((res) =>
          dispatch(updateProductInfo({ nutritional_ingredients: res.data }))
        ),
      ]);
      unitData.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });

      setInitData({
        country: countryData,
        category: categoryData,
        unitData: unitData,
        sub_category: convertArrayToObject(categoryData, 'id'),
        ingredient: [],
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resetData()
    if (!productName || !productCate || !productSubCate) {
      resetData()
      jumpStep(1);
    }
    getInitData();
  }, []);

  const removeErrors = (key) => {
    const newError = [...errors.filter((item) => item !== key)];

    setErrors(newError);
  };

  const onUpdateAvatar = async (e) => {
    const files = e.target.files;
    if (files.length < 1) return;
    setLoadingImg(true);
    function readImage(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.fileName = file.name;
        reader.onloadend = (readerEvt) => {
          var base64result = reader.result.split(',')[1];
          resolve({
            imageUrl: reader.result,
            enc: base64result,
            fileName: readerEvt.target.fileName,
          });
        };

        if (file) {
          reader.readAsDataURL(file);
        }
      });
    }
    let promiseList = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (!file.type.match('image')) continue;
      promiseList = [...promiseList, readImage(file)];
    }

    const result = await Promise.all(promiseList);
    setLoadingImg(false);
    const checkData = [...imgData, ...result];

    if (checkData.length < 1 || checkData.length > 6) {
      setErrors([...errors, 'image']);
    } else {
      removeErrors('image');
    }
    setImgData([...imgData, ...result]);
  };

  const handleChangeInput = useCallback(
    (item, newValue) => (e) => {
      setFormData({
        ...formData,
        [item.key]: newValue || e.target.value,
      });

      if (item.required && !e.target.value) {
        setErrors([...errors, item.key]);
      } else {
        removeErrors(item.key);
      }
    },
    [formData]
  );

  const handleSelectInput = (key, newValue) => {
    if (!newValue) {
      setErrors([...errors, key]);
    } else {
      removeErrors(key);
    }
    setFormData({
      ...formData,
      [key]: newValue,
    });
  };

  const handleRemoveImgByIndex = (index) => (e) => {
    e.stopPropagation();
    const _imgData = [...imgData];
    _imgData.splice(index, 1);
    setImgData(_imgData);
  };

  const validateStep1 = (key, value) => {
    if (key === 'category') {
      setErrorValidate({
        ...errorValidate,
        [key]: true,
      });
    } else if (key === 'sub_category') {
      setErrorValidate({
        ...errorValidate,
        category: isEmpty(productCate) || isEmpty(value),
      });
    } else {
      setErrorValidate({
        ...errorValidate,
        [key]: !value,
      });
    }
  };

  const validateAllForm = () => {
    const listEmpty = inputList
      .filter((item) => !formData[item.key] && item.required)
      .map((i) => i.key);

    if (imgData.length < 1 || imgData.length > 6) {
      listEmpty.push('image');
    }

    if (!productName) {
      listEmpty.push('name');
    }

    if (!productCate || !productSubCate) {
      listEmpty.push('category');
    }
    setErrors(listEmpty);
    if (listEmpty.length > 0) return false;

    return true;
  };

  const handleNextStep1 = () => {
    nextStep();
  };

  const handleProductNameChange = (event) => {
    dispatch(updateProductName(event.target.value));
    if (!event?.target?.value) {
      setErrors([...errors, 'name']);
    } else {
      removeErrors('name');
    }
  };

  const handleChangeExpireDay = (event) => {
    setFormData({
      ...formData,
      expire_date: event.target.value,
    });
  };

  const handleChangeExpireDayUnit = (event) => {
    setFormData({
      ...formData,
      expire_date_unit: event.target.value,
    });
  };

  const getListDropdown = useCallback(() => {
    return inputList.map((item) => {
      const {
        key,
        label,
        type,
        helperText,
        required,
        col,
        rows,
        multiline,
        dataKey,
        parentDataKey,
      } = item;
      const isError = errors.includes(key);
      const isSelect = type === 'select';
      if (isSelect) {
        let listDataSelect = initData[dataKey];
        if (parentDataKey) {
          const parentKey = formData[parentDataKey];
          if (parentKey) {
            listDataSelect = listDataSelect[parentKey][dataKey];
          } else {
            listDataSelect = [];
          }
        }
        return (
          <Grid container className={classes.fieldWrapper}>
            <Grid item className={classes.labelWrapper} xs={4}>
              <Typography className={classes.label} align='justify'>
                {label}
              </Typography>
            </Grid>
            <Grid item key={key} xs={8}>
              <Autocomplete
                id={key}
                options={listDataSelect}
                getOptionLabel={(option) => option?.name || ''}
                value={
                  listDataSelect.filter((item) => item._id === formData[key])[0]
                }
                onChange={(event, newValue) => {
                  handleSelectInput(key, newValue?._id);
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    error={isError}
                    label={label}
                    helperText={isError ? helperText : ''}
                    variant='outlined'
                    onChange={handleChangeInput(item)}
                  />
                )}
              />
            </Grid>
          </Grid>
        );
      }

      return (
        <Grid container className={classes.fieldWrapper}>
          <Grid item className={classes.labelWrapper} xs={4}>
            <Typography className={classes.label} align='justify'>
              {label}
            </Typography>
          </Grid>
          <Grid item key={key} xs={8}>
            <TextField
              fullWidth
              error={isError}
              id={key}
              label={label}
              helperText={isError ? helperText : ''}
              variant='outlined'
              type={type}
              value={formData[key]}
              onChange={handleChangeInput(item)}
              multiline={!!multiline}
              rows={!!multiline ? rows : null}
            />
          </Grid>
        </Grid>
      );
    });
  }, [errors, initData, handleChangeInput, formData]);

  return (
    <>
      <Box display='flex' justifyContent='center' pt={10} pb={4}>
        {curentStep === 1 && (
          <FirstStepCreateProduct
            category={initData.category}
            sub_category={initData.sub_category}
            nextStep={handleNextStep1}
            isError={errorValidate}
            validateStep1={validateStep1}
          />
        )}

        {curentStep === 2 && (
          <Box minHeight='536px' width={1}>
            <TabScrollVerticalNavigate />
            <Element name='basic_info'>
              <Grid
                container
                spacing={2}
                className={classes.section}
                id='thongtincoban'>
                <Paper style={{ width: '100%', padding: '1.5rem' }}>
                  <Typography variant='h6' style={{ marginBottom: '1rem' }}>
                    Thông tin cơ bản
                  </Typography>
                  <Grid container className={classes.fieldWrapper}>
                    <Grid item className={classes.labelWrapper} xs={4}>
                      <Typography className={classes.label} align='justify'>
                        Hình ảnh sản phẩm
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Box>
                        <Box display='flex' justifyContent='center'>
                          <BoxDragDropImage
                            listImgData={imgData}
                            onClick={handleBoxImgClick}
                            handleRemove={handleRemoveImgByIndex}
                            isMulti
                          />
                        </Box>
                        {errors.includes('image') && (
                          <Box mt={1}>
                            <Typography variant='subtitle1' color='error'>
                              {imgData.length < 1
                                ? 'Vui lòng chọn ít nhất 1 ảnh cho sản phẩm!'
                                : 'Tối đa 6 ảnh cho sản phẩm!'}
                            </Typography>
                          </Box>
                        )}
                        <Box mt={3}>
                          <Button
                            color='primary'
                            component='label'
                            fullWidth
                            variant='outlined'>
                            <Typography align='center' variant='subtitle1'>
                              <Box minWidth='250px' px={3}>
                                Upload ảnh sản phẩm
                              </Box>
                            </Typography>
                            <input
                              ref={inputImg}
                              type='file'
                              style={{ display: 'none' }}
                              onChange={onUpdateAvatar}
                              accept='image/*'
                              multiple
                            />
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.fieldWrapper}>
                    <Grid item className={classes.labelWrapper} xs={4}>
                      <Typography className={classes.label} align='justify'>
                        Tên sản phẩm
                      </Typography>
                    </Grid>
                    <Grid item key={'name'} xs={8}>
                      <TextField
                        fullWidth
                        error={errors.includes('name')}
                        id={'name'}
                        label={'Tên sản phẩm'}
                        // defaultValue="Hello World"
                        helperText={
                          errors.includes('name')
                            ? 'Vui lòng nhập tên sản phẩm.'
                            : ''
                        }
                        variant='outlined'
                        value={productName}
                        onChange={handleProductNameChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container className={classes.fieldWrapper}>
                    <Grid item className={classes.labelWrapper} xs={4}>
                      <Typography className={classes.label} align='justify'>
                        Danh mục
                      </Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex' }}>
                      <Typography className={classes.selectedItem}>
                        {productCate?.name}{' '}
                        {productSubCate?.name ? `> ${productSubCate.name}` : ''}
                      </Typography>
                      <EditOutlinedIcon
                        className={classes.editIcon}
                        onClick={() => {
                          jumpStep(1);
                        }}
                      />
                      {errors.includes('category') && (
                        <Box mt={1}>
                          <Typography variant='subtitle1' color='error'>
                            Vui lòng chọn đầy đủ danh mục cho sản phẩm!
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container className={classes.fieldWrapper}>
                    <Grid item className={classes.labelWrapper} xs={4}>
                      <Typography className={classes.label} align='justify'>
                        Hạn sử dụng
                      </Typography>
                    </Grid>
                    <Grid
                      className={classes.expireField}
                      item
                      key={'name'}
                      xs={8}>
                      <TextField
                        fullWidth
                        error={errors.includes('expire_date')}
                        id='expire_date'
                        label='Hạn sử dụng'
                        variant='outlined'
                        value={formData['expire_date']}
                        style={{ marginRight: 5 }}
                        type='number'
                        onChange={handleChangeExpireDay}
                      />
                      <TextField
                        fullWidth
                        id='expire_date_unit'
                        defaultValue='day'
                        // helperText={isError ? helperText : ''}
                        variant='outlined'
                        value={formData['expire_date_unit']}
                        onChange={handleChangeExpireDayUnit}
                        select>
                        {[
                          { key: 'day', name: 'ngày' },
                          { key: 'month', name: 'tháng' },
                          { key: 'year', name: 'năm' },
                        ].map((option) => (
                          <MenuItem key={option.key} value={option.key}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  {getListDropdown()}
                </Paper>
              </Grid>
            </Element>

            <Element name='ingredient'>
              <Grid
                container
                spacing={2}
                mb={2}
                className={classes.section}
                id='thanhphan'>
                <Paper style={{ width: '100%', padding: '1.5rem' }}>
                  <UpdateIngredients
                    ingredients={ingredients}
                    ref={ingredientRef}
                  />
                </Paper>
              </Grid>
            </Element>

            <Element name='nutritional_ingredient'>
              <Grid container spacing={2} mb={2} className={classes.section}>
                <Paper style={{ width: '100%', padding: '1.5rem' }}>
                  <UpdateNutritional />
                </Paper>
              </Grid>
            </Element>

            <Element name='sale_info'>
              <Grid container spacing={2} mb={2} className={classes.section}>
                <Paper style={{ width: '100%', padding: '1.5rem' }}>
                  <UpdatePrice isRetail={isRetail} ref={priceRef} />
                </Paper>
              </Grid>
            </Element>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    jumpStep(1);
                  }}>
                  <Box py={1}>Quay lại </Box>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  // disabled={() => {
                  //   validateAllForm
                  // }}
                  onClick={handleFinishCreate}>
                  <Box py={1}>Hoàn tất</Box>
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
}
