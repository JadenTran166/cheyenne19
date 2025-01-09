import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CommonChoiceBox from '../../components/CommonChoiceBox';
import boxImg from '../../assets/icon/box.svg';
import truckImg from '../../assets/icon/truck.svg';
import useQuery from '../../hooks/useQuery';
import { useHistory } from 'react-router-dom';
import useStep from '../../hooks/useStep';
import axiosService from '../../config/axiosService';
import { ENV_API_ENDPOINT } from '../../env/local';
import BoxDragDropImage from '../../components/BoxDragDropImage';
import UpdateIngredientProduct from './UpdateIngredientProduct';
import { convertArrayToObject, findValueInArrayeBy } from '../../utils';
import PreviewProduct from './PreviewProduct';
import Swal from 'sweetalert2';
import { listRouteByKey } from '../../config/configureRoute';
import CreateTempSite from './CreateTempSite';

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

const inputList = [
  {
    key: 'name',
    label: 'Tên sản phẩm',
    type: 'text',
    helperText: 'Vui lòng nhập tên sản phẩm.',
    required: true,
    col: 12,
  },
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
    key: 'category',
    label: 'Danh mục',
    type: 'select',
    dataKey: 'category',
    helperText: 'Vui lòng chọn danh mục.',
    required: true,
    col: 6,
  },
  {
    key: 'sub_category',
    label: 'Danh mục con',
    type: 'select',
    dataKey: 'sub_category',
    helperText: 'Vui lòng chọn danh mục con.',
    required: true,
    col: 6,
    parentDataKey: 'category',
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

export default function CreateProduct() {
  const query = useQuery();
  const history = useHistory();
  const { curentStep, prevStep, nextStep, jumpStep } = useStep(8);
  const [dataStep1, setDataStep1] = useState(() => {
    const st1 = query.get('st1');
    if (['0', '1'].includes(st1)) return +st1;
    return null;
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [idTemp, setIdTemp] = useState(null);

  const [loadingImg, setLoadingImg] = useState(false);
  const [imgData, setImgData] = useState([]);

  const [isFirstCheckStep2, setIsFirstCheckStep2] = useState(false);
  const [listIngredient, setListIngredient] = useState([]);

  const [isDisableCreateTemp, setIsDisableCreateTemp] = useState(false);

  const createTempSiteRef = useRef(null);

  const [initData, setInitData] = useState({
    country: [],
    category: [],
    sub_category: [],
    unitData: [],
    ingredient: [],
  });
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    category: '',
    sub_category: '',
    description: '',
    unit: '',
  });

  const inputImg = useRef(null);

  function handleBoxImgClick() {
    inputImg.current.click();
  }

  function clearData() {
    setIsFirstCheckStep2(false);
    setListIngredient([]);
    setImgData([]);
    setErrors([]);
    setFormData({
      name: '',
      country: '',
      category: '',
      sub_category: '',
      description: '',
      unit: '',
    });
    setIdTemp(null);
  }

  function handleFinishCreate() {
    const { name, unit, sub_category, country, description } = formData;
    axiosService
      .post('/product', {
        self_create: dataStep1 == 0,
        temp_site: dataStep1 == 0 ? false : idTemp._id,
        unit,
        short_description: '',
        detail_description: description,
        imgs: imgData.map(({ imageUrl }) => imageUrl),
        ingredients: listIngredient.map((item) => item.product_id.id),
        name,
        sub_category,
        country,
      })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Tạo sản phẩm thành công',
          text: 'Bạn muốn tiếp tục tạo sản phẩm ?',
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonText: 'Tiếp tục',
          cancelButtonText: `Hủy`,
        }).then((result) => {
          if (result.isConfirmed) {
            jumpStep(1);
          } else {
            history.push(listRouteByKey['home'].path);
          }
          clearData();
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Tạo sản phẩm thất bại',
          showConfirmButton: false,
          timer: 2000,
        });
      });
  }

  useEffect(() => {
    // jumpStep(4);
    if (dataStep1 || dataStep1 === 0) {
      handleNextStep1();
    }
    getInitData();
  }, []);

  const getInitData = async () => {
    try {
      const requestCategory = axiosService.get(`${ENV_API_ENDPOINT}/category`);
      const requestCountry = axiosService.get(`${ENV_API_ENDPOINT}/country`);
      const requestIngredients = axiosService.get(
        `${ENV_API_ENDPOINT}/ingredient-in-site?site_type=all&limit=100`
      );
      const requestUnit = axiosService.get(`${ENV_API_ENDPOINT}/unit`);

      const [
        categoryData,
        countryData,
        ingreData,
        unitData,
      ] = await Promise.all([
        requestCategory.then((res) => res.data),
        requestCountry.then((res) => res.data),
        requestIngredients.then((res) => res.data),
        requestUnit.then((res) => res.data),
      ]);
      unitData.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });

      setInitData({
        country: countryData,
        category: categoryData,
        unitData: unitData,
        sub_category: convertArrayToObject(categoryData, 'id'),
        ingredient: ingreData,
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
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
    setImgData([...imgData, ...result]);
  };

  const handleChangeInput = useCallback(
    (item) => (e) => {
      setFormData({
        ...formData,
        [item.key]: e.target.value,
        ...(function () {
          if (item.key === 'category') {
            return { sub_category: '' };
          }
          return {};
        })(),
      });
    },
    [formData]
  );

  const handleRemoveImgByIndex = (index) => (e) => {
    e.stopPropagation();
    const _imgData = [...imgData];
    _imgData.splice(index, 1);
    setImgData(_imgData);
  };

  const validateStep2 = () => {
    const listEmpty = inputList
      .filter((item) => !formData[item.key] && item.required)
      .map((i) => i.key);

    if (imgData.length < 1 || imgData.length > 6) {
      listEmpty.push('image');
    }
    setErrors(listEmpty);
    if (listEmpty.length > 0) return false;

    return true;
  };

  const handleNextStep1 = () => {
    if (dataStep1 == 0) {
      nextStep();
    } else {
      jumpStep(6);
    }
  };

  const handleNextStep2 = () => {
    if (!isFirstCheckStep2) {
      const result = validateStep2();
      setIsFirstCheckStep2(true);
      if (result) {
        nextStep();
      } else return;
    }
    if (isFirstCheckStep2 && errors.length > 0) return;

    nextStep();
  };

  // const getDateInList = useCallback(findValueInArrayeBy, [formData]);

  const passIsDisabledToParent = (value) => {
    setIsDisableCreateTemp(value);
  };

  const handleSelectRow = useCallback((rows) => {
    setListIngredient(rows);
  }, []);

  const handleRemoveRow = useCallback(
    (row) => {
      setListIngredient([
        ...listIngredient.filter((item) => item._id !== row._id),
      ]);
    },
    [listIngredient]
  );

  const handleNextStepCreateTempSite = async () => {
    const {
      setIsFirstCheck,
      optionTS,
      onCreateTemp,
      validateTempChoose,
    } = createTempSiteRef.current;
    // setIsFirstCheck(true);
    let idTemp = null;
    if (optionTS === 'create_temp') {
      const resultCreate = await onCreateTemp();
      if (resultCreate?._id) {
        idTemp = resultCreate;
      }
    } else {
      const result = validateTempChoose(true);
      idTemp = result;
    }

    if (!idTemp?._id) return;
    setIdTemp(idTemp);
    jumpStep(2);
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
          <Grid item key={key} xs={col}>
            <TextField
              fullWidth
              error={isError}
              id={key}
              label={label}
              defaultValue=''
              helperText={isError ? helperText : ''}
              variant='outlined'
              value={formData[key]}
              onChange={handleChangeInput(item)}
              select>
              {listDataSelect.length > 0
                ? listDataSelect.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
        );
      }

      return (
        <Grid item key={key} xs={col}>
          <TextField
            fullWidth
            error={isError}
            id={key}
            label={label}
            // defaultValue="Hello World"
            helperText={isError ? helperText : ''}
            variant='outlined'
            value={formData[key]}
            onChange={handleChangeInput(item)}
            multiline={!!multiline}
            rows={!!multiline ? rows : null}
          />
        </Grid>
      );
    });
  }, [errors, initData, handleChangeInput, formData]);

  useEffect(() => {
    if (!isFirstCheckStep2) return;
    validateStep2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, imgData]);

  useEffect(() => {
    query.set('st1', dataStep1);
    history.replace(`${history.location.pathname}?${query.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStep1]);

  return (
    <Box display='flex' justifyContent='center' pt={10} pb={4}>
      {curentStep === 1 && (
        <Box minHeight='536px' width={1} maxWidth='355px'>
          <Typography variant='h6'>Sản phẩm thuộc về:</Typography>
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
        <Box minHeight='536px' width={1} maxWidth='552px'>
          <Typography variant='h6'>
            Tạo sản phẩm (
            {dataStep1 == 0 ? 'Cho chính bạn' : `Cho site ${idTemp?.name}`})
          </Typography>
          <Box display='flex' my={4}>
            <Grid container spacing={2}>
              {getListDropdown()}
              <Grid item xs={12}>
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
                      <Typography variant='subtitle1'>
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
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant='outlined'
                color='primary'
                onClick={() => {
                  prevStep();
                }}>
                <Box py={1}>Quay lại </Box>
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant='contained'
                color='primary'
                disabled={isFirstCheckStep2 && errors.length > 0}
                onClick={handleNextStep2}>
                <Box py={1}>Tiếp theo</Box>
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {curentStep === 3 && (
        <Box display='flex' alignItems='center' minHeight='536px'>
          <Box
            width={1}
            textAlign='center'
            display='flex'
            alignItems='center'
            flexDirection='column'>
            <Typography variant='h6'>Nguyên liệu</Typography>
            <Typography variant='subtitle1'>
              Bạn có muốn thêm nguyên liệu cho sản phẩm này hay không ?
            </Typography>

            <Box mt={2} minWidth='75%'>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant='outlined'
                    color='primary'
                    onClick={() => {
                      jumpStep(curentStep + 2);
                    }}>
                    <Box>Không</Box>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      nextStep();
                    }}>
                    <Box>Có</Box>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      )}

      {curentStep === 4 && (
        <Box minHeight='536px' width={1}>
          <Paper>
            <Box px={[1, 4, 6]} py={[1, 3]}>
              <Typography variant='h6'>Nguyên liệu</Typography>
              <Box display='flex' my={4}>
                <UpdateIngredientProduct
                  ingredients_data={initData.ingredient}
                  selected_ingre={listIngredient}
                  handleSelectRow={handleSelectRow}
                  handleRemoveRow={handleRemoveRow}
                />
              </Box>
              <Box display='flex' justifyContent='flex-end'>
                <Box minWidth='355px'>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant='outlined'
                        color='primary'
                        onClick={() => {
                          jumpStep(curentStep - 2);
                        }}>
                        <Box py={1}>Quay lại </Box>
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant='contained'
                        color='primary'
                        disabled={isFirstCheckStep2 && errors.length > 0}
                        onClick={() => {
                          nextStep();
                        }}>
                        <Box py={1}>Tiếp theo</Box>
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {curentStep === 5 && (
        <Box minHeight='536px' width={1} maxWidth='790px'>
          <Typography variant='h6'>Xem lại thông tin</Typography>
          <Box display='flex' my={4}>
            <PreviewProduct
              name={formData.name}
              description={formData.description}
              listImg={imgData.map(({ imageUrl }) => imageUrl)}
              listIngredient={listIngredient}
              country={
                findValueInArrayeBy(
                  [...initData.country],
                  '_id',
                  formData.country
                ).name
              }
              unit={
                findValueInArrayeBy(
                  [...initData.unitData],
                  '_id',
                  formData.unit
                ).name
              }
              category={
                findValueInArrayeBy(
                  [...initData.category],
                  '_id',
                  formData.category
                ).name
              }
              sub_category={
                findValueInArrayeBy(
                  [...initData.sub_category[formData.category].sub_category],
                  '_id',
                  formData.sub_category
                ).name
              }
            />
          </Box>
          <Box display='flex' justifyContent='center'>
            <Box width='550px' maxWidth='100%'>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant='outlined'
                    color='primary'
                    onClick={() => {
                      prevStep();
                    }}>
                    <Box py={1}>Quay lại </Box>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    disabled={isFirstCheckStep2 && errors.length > 0}
                    onClick={handleFinishCreate}>
                    <Box py={1}>Hoàn tất</Box>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      )}

      {/* CREATE TEMP SITE STEP */}
      {curentStep === 6 && (
        <Box minHeight='536px' width={1} maxWidth='552px'>
          <Typography variant='h6'>
            Hãy chọn công ty (tạm)* mà bạn muốn tạo sản phẩm
          </Typography>
          <Typography variant='body2'>
            <Box component='span' color='#9496A5'>
              Công ty tạm là những công ty chưa có trên hệ thống của Cheyenne19,
              nếu trong danh sách chưa có Công ty bạn tìm kiếm, hãy chọn “Tạo
              site tạm”
            </Box>
          </Typography>
          <Box display='flex' my={4}>
            <Grid container spacing={2}>
              <CreateTempSite
                ref={createTempSiteRef}
                passIsDisabledToParent={passIsDisabledToParent}
              />
            </Grid>
          </Box>
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
                disabled={isDisableCreateTemp}
                onClick={handleNextStepCreateTempSite}>
                <Box py={1}>Tiếp theo</Box>
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
