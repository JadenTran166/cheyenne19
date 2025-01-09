import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import BoxDragDropImage from '../../components/BoxDragDropImage';
import { axiosAssetService } from '../../config/axiosService';

const inputList = [
  {
    key: 'name',
    label: 'Tên sản phẩm',
    type: 'text',
    helperText: 'Vui lòng nhập tên sản phẩm.',
    required: true,
    col: 12,
    isMy: true,
  },
  {
    key: 'country',
    label: 'Quốc gia',
    type: 'select',
    dataKey: 'country',
    helperText: 'Vui lòng chọn quốc gia.',
    required: true,
    col: 6,
    isMy: true,
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
    isMy: true,
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
    isMy: true,
  },
  {
    key: 'hscode',
    label: 'Mã số biểu thuế',
    type: 'text',
    helperText: 'Vui lòng nhập số biểu thuế.',
    col: 4,
    isMy: true,
  },
  {
    key: 'barcode',
    label: 'Mã vạch',
    type: 'text',
    helperText: 'Vui lòng nhập số mã vạch.',
    col: 4,
    isMy: true,
  },
  {
    key: 'weight',
    label: 'Khối lượng',
    type: 'text',
    helperText: 'Vui lòng nhập khối lượng.',
    col: 4,
    isMy: true,
  },
  {
    key: 'instruction',
    label: 'Hướng dẫn sử dụng',
    type: 'textarea',
    helperText: '',
    required: false,
    col: 12,
    multiline: true,
    rows: 5,
    isMy: true,
  },
  {
    key: 'preservation',
    label: 'Khuyến cáo',
    type: 'textarea',
    helperText: '',
    required: false,
    col: 12,
    multiline: true,
    rows: 5,
    isMy: true,
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
    isMy: true,
  },
];

const UpdateInfo = forwardRef((props, ref) => {
  const { initData, isMy } = props;
  const [errors, setErrors] = useState([]);
  const [isFirstCheck, setIsFirstCheck] = useState(false);
  const [formData, setFormData] = useState(() => {
    const {
      name,
      country,
      sub_category,
      detail_description,
      product_in_site,
      instruction,
      preservation,
      hscode,
      barcode,
      weight,
    } = props.data;
    return {
      name,
      country: country?._id,
      category: sub_category?.category_id,
      sub_category: sub_category?._id,
      description: detail_description,
      unit: product_in_site?.[0].unit?._id,
      instruction,
      preservation,
      hscode,
      barcode,
      weight,
    };
  });

  const [imgData, setImgData] = useState([]);

  const inputImg = useRef(null);

  const [loadingImg, setLoadingImg] = useState(false);

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

  function handleBoxImgClick() {
    inputImg.current.click();
  }

  const validateData = () => {
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

  const handleValidateData = () => {
    if (!isFirstCheck) {
      const result = validateData();
      setIsFirstCheck(true);
      if (result) {
        return true;
      } else return false;
    }
    if (isFirstCheck && errors.length > 0) return false;

    return true;
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
        isMy,
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
              disabled={!props.isMy && !!isMy === !props.isMy}
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
            disabled={!props.isMy && !!isMy === !props.isMy}
            fullWidth
            error={isError}
            id={key}
            label={label}
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

  const onUpdateAvatar = async (e) => {
    const files = e.target.files;
    if (files.length < 1) return;
    setLoadingImg(true);
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

  useEffect(() => {
    props.handleUpdateInfo({
      ...formData,
      imgs: [...imgData],
    });
    if (!isFirstCheck) return;
    validateData();
  }, [formData, imgData]);

  useEffect(() => {
    async function fetchImg() {
      try {
        const { imgs } = props.data;
        if (imgs.length < 1) return;
        const listRequest = [
          ...imgs.map((item) => axiosAssetService.get(item.link)),
        ];
        const listRes = await Promise.all([...listRequest]);
        setLoadingImg(true);
        let promiseList = [];
        for (let i = 0; i < listRes.length; i++) {
          let data = listRes[i];
          if (!(data.status === 200)) continue;
          promiseList = [...promiseList, readImage(data.data)];
        }
        const result = await Promise.all(promiseList);
        setLoadingImg(false);
        setImgData([...imgData, ...result]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchImg();
  }, []);

  useImperativeHandle(ref, () => ({
    handleValidateData,
  }));

  return (
    <Box display='flex'>
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
                isMy={props.isMy}
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
            {props.isMy && (
              <Box mt={3}>
                <Button
                  color='primary'
                  component='label'
                  fullWidth
                  variant='outlined'>
                  <Typography variant='subtitle1'>
                    <Box minWidth='250px' px={3} textAlign='center'>
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
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

export default UpdateInfo;
