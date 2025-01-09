import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import axiosService from '../../config/axiosService';
import { createFilterOptions, Autocomplete } from '@material-ui/lab';
import Swal from 'sweetalert2';

const tempOptions = {
  create_temp: {
    label: 'Tạo mới',
    value: 'create_temp',
  },
  list_temp: {
    label: 'Danh sách cửa hàng tạm',
    value: 'list_temp',
  },
};
const CreateTempSite = forwardRef((props, ref) => {
  const [tempSite, setTempSite] = useState(null);
  const [optionTS, setOptionTS] = useState('');
  const [tempSiteValue, setTempSiteValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [arrError, setArrError] = useState([]);
  const [isFirstCheck, setIsFirstCheck] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const filterOptions = createFilterOptions({
    stringify: (option) => option.name,
  });

  const [createForm, setCreateForm] = useState({
    site_name: '',
    address: '',
    tel: '',
  });

  const getTempSiteData = async () => {
    try {
      const res = await axiosService.get('/temp/site');
      const { data } = res;
      setTempSite(data);
    } catch (error) {}
  };

  const validateForm = () => {
    const keys = Object.keys(createForm);
    let arrErr = [];
    keys.forEach((key) => {
      if (!createForm[key]) arrErr.push(key);
    });
    if (arrErr.length > 0) {
      setArrError(arrErr);
      setIsDisabled(isFirstCheck && arrErr.length > 0);
    } else {
      setArrError([]);
      setIsDisabled(false);
    }
  };

  const validateTempChoose = (firstCheck = false) => {
    if (!tempSiteValue?._id) {
      setArrError(['listTemp']);
    } else {
      setArrError([]);
    }

    if (firstCheck) {
      setIsFirstCheck(true);
      setIsDisabled(true && !tempSiteValue?._id);
    } else {
      setIsDisabled(isFirstCheck && !tempSiteValue?._id);
    }
    return tempSiteValue;
  };

  useEffect(() => {
    if (!isFirstCheck) return;
    validateForm();
  }, [createForm]);

  useEffect(() => {
    if (!isFirstCheck) return;
    validateTempChoose();
  }, [tempSiteValue]);

  useEffect(() => {
    // debugger;
    if (!props.passIsDisabledToParent) return;
    props.passIsDisabledToParent(isDisabled);
  }, [isDisabled]);

  // useEffect(() => {
  //   if (isFirstCheck) {
  //     props.passIsDisabledToParent(true);
  //   }
  // }, [isFirstCheck]);

  const resetData = () => {
    setIsFirstCheck(false);
    setArrError([]);
    setCreateForm({
      site_name: '',
      address: '',
      tel: '',
    });
    setInputValue('');
    setIsDisabled(false);
    props.passIsDisabledToParent && props.passIsDisabledToParent(false);
    setTempSiteValue(null);
  };
  useEffect(() => {
    resetData();
  }, [optionTS]);

  const onCreateTempsite = (firstCheck = false) => {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(createForm);
      let arrErr = [];
      keys.forEach((key) => {
        if (!createForm[key]) arrErr.push(key);
      });
      if (arrErr.length > 0) {
        setArrError(arrErr);
        if (firstCheck) {
          setIsFirstCheck(true);
          setIsDisabled(true);
        }
      } else {
        setArrError([]);
        const { site_name: name, tel: phone_number, address } = createForm;
        axiosService
          .post(
            '/temp/site',
            {
              name,
              address,
              phone_number,
            },
            {}
          )
          .then(({ data }) => {
            resolve(data);
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: "Can't create temp site",
            });
            //   enqueueSnackbar(error?.message || "Can't load ingredient", {
            //     variant: "error",
            //   });
          });
      }
    });
  };

  const handleChangeFormCreate = (e) => {
    const { value, name } = e.target;
    setCreateForm({ ...createForm, [name]: value });
  };

  useImperativeHandle(ref, () => ({
    onCreateTemp: onCreateTempsite,
    setIsFirstCheck,
    validateTempChoose,
    optionTS,
    inputValue,
  }));

  useEffect(() => {
    if (!optionTS) {
      props.passIsDisabledToParent && props.passIsDisabledToParent(true);
    }
    getTempSiteData();
  }, []);

  return (
    <Box width={1}>
      <Box minWidth={300} mb={2} width={1}>
        <FormControl fullWidth variant='outlined'>
          <InputLabel id='label-select-temp-site'>Chọn cửa hàng tạm</InputLabel>
          <Select
            labelId='label-select-temp-site'
            id='temp-site-select'
            value={optionTS}
            label='Chọn cửa hàng tạm'
            onChange={(e) => setOptionTS(e.target.value)}>
            {Object.values(tempOptions).map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {optionTS === tempOptions.list_temp.value && (
        <Box minWidth={300} mb={2}>
          <Autocomplete
            id='autocomplete-temp-site'
            value={tempSiteValue}
            onChange={(event, data) => {
              setTempSiteValue(data);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) =>
              setInputValue(newInputValue)
            }
            options={tempSite || []}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.name
            }
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Tên cửa hàng tạm'
                variant='outlined'
                error={arrError.includes('listTemp')}
                helperText={
                  arrError.includes('listTemp')
                    ? 'Vui lòng chọn tên cửa hàng tạm.'
                    : ''
                }
              />
            )}
          />
        </Box>
      )}

      {optionTS === tempOptions.create_temp.value && (
        <Box>
          <Box minWidth={300} mb={2}>
            <TextField
              name='site_name'
              label='Tên cửa hàng tạm'
              variant='outlined'
              fullWidth
              value={createForm.site_name}
              error={arrError.indexOf('site_name') < 0 ? false : true}
              helperText={
                arrError.indexOf('site_name') < 0
                  ? ''
                  : 'Vui lòng điền tên cửa hàng.'
              }
              onChange={handleChangeFormCreate}
            />
          </Box>
          <Box minWidth={300} mb={2}>
            <TextField
              name='address'
              label='Địa chỉ'
              variant='outlined'
              error={arrError.indexOf('address') < 0 ? false : true}
              helperText={
                arrError.indexOf('address') < 0 ? '' : 'Vui lòng nhập địa chỉ'
              }
              fullWidth
              value={createForm.address}
              onChange={handleChangeFormCreate}
            />
          </Box>
          <Box minWidth={300} mb={2}>
            <TextField
              name='tel'
              label='Số điện thoại'
              variant='outlined'
              error={arrError.indexOf('tel') < 0 ? false : true}
              helperText={
                arrError.indexOf('tel') < 0 ? '' : 'Vui lòng nhập số điện thoại'
              }
              fullWidth
              value={createForm.tel}
              onChange={handleChangeFormCreate}
            />
          </Box>
          {/* <Box minWidth={300} mb={2}>
            <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onCreateTempsite}
            >
            Thêm
            </Button>
        </Box> */}
        </Box>
      )}
    </Box>
  );
});

export default CreateTempSite;
