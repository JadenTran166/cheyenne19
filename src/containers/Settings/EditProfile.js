import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import useUserData from 'hooks/useUserData';
import { find } from 'lodash';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Alert } from 'utils';
import InputWrapper from '../../components/InputWrapper';
import axiosService from '../../config/axiosService';
import { setLoading } from '../../slice/global';
import {
  updateUserBusinessData,
  updateUserSiteData,
} from '../../slice/userSlice';

const useStyles = makeStyles((theme) => ({
  root: {},
  input: {
    marginBottom: theme.spacing(3),
  },
  select: {
    width: '100%',
  },
}));
export default function EditProfile(props) {
  const { userData } = useUserData();
  // const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const formatAddressData = () => {
    const addressSampleData = props.initData.addressSampleData;
    const { province_code, state_code, street, ward_code } =
      userData?.site?.address;
    const state = find(addressSampleData, (item) => item?.code === state_code);

    const province = find(
      state?.districts,
      (item) => item.codename === province_code
    );
    const ward = find(province?.wards, (item) => item.codename === ward_code);
    return {
      province,
      ward,
      state,
      street: street,
    };
  };

  const [selectAddress, setSelectAddress] = useState({
    selectedCity: formatAddressData().state,
    selectedDistrict: formatAddressData().province,
    selectedWard: formatAddressData().ward,
    street: formatAddressData().street || '',
  });

  const onSubmit = (data) => {
    dispatch(setLoading(true));
    if (props.initData?.categories?.length) {
      data.sub_category = props.initData.categories.reduce(
        (objData, i, index) => {
          if (!data[`sub_categories_${index}`]) return objData;
          let newData = [...objData, ...data[`sub_categories_${index}`]];
          delete data[`sub_categories_${index}`];
          return newData;
        },
        []
      );
    }
    data.company_name = data.name;
    delete data.name;

    axiosService
      .patch('/business', {
        ...data,
        address: {
          province_code: selectAddress?.selectedDistrict?.codename || '',
          ward_code: selectAddress?.selectedWard?.codename || '',
          state_code: selectAddress?.selectedCity?.code || '',
          street: data?.street || '',
        },
        // form_id: '5f8f01ac53fc7e2210ad607b',
      })
      .then((res) => {
        let dataAlert = {
          title: 'Cập nhật thông tin thành công',
          icon: 'success',
          showConfirmButton: false,
        };
        const { site, business } = res.data;

        dispatch(updateUserSiteData(site));
        dispatch(updateUserBusinessData(business));

        Alert.fire(dataAlert);
      })
      .catch((err) => {
        let dataAlert = {
          title: 'Cập nhật thông tin không thành công',
          html: err.response.data.message
            ? err.response.data.message
            : 'Đã có lỗi xảy ra',
          timer: 3000,
          icon: 'error',
        };
        Alert.fire(dataAlert);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const newDataRef = useRef(
    (() => {
      const {
        name,
        business_model,
        form,
        sub_categories,
        scale,
        phone_number,
      } = userData.site || {};

      const listSubData = props.initData.categories.map(
        ({ name, sub_category }, index) => {
          let option = [];
          let defaultValue = [];
          sub_category.forEach(({ _id, name }) => {
            if (sub_categories?.includes(_id)) {
              defaultValue.push(_id);
            }
            option.push({
              value: _id,
              label: name,
            });
          });

          return {
            key: `sub_categories_${index}`,
            label: index === 0 ? 'Lĩnh vực kinh doanh của bạn là:' : '',
            subLabel: name,
            type: 'checkbox_group',
            defaultValue,
            option,
            col: [6, 3],
            radioProps: {
              row: true,
            },
          };
        }
      );

      const newData = [
        {
          key: 'name',
          label: 'Tên Công Ty',
          type: 'text',
          defaultValue: name || '',
          col: [6, 6],
        },
        {
          key: 'phone_number',
          label: 'Số điện thoại doanh nghiệp',
          type: 'text',
          defaultValue: phone_number,
          col: [6, 6],
        },
        {
          key: 'street',
          label: 'Tên đường:',
          type: 'text',
          defaultValue: selectAddress.street,
          col: [12, 6],
        },
        {
          key: 'model_id',
          label: 'Bạn là:',
          type: 'radio',
          defaultValue: business_model,
          option: props.initData.model
            ? props.initData.model.map((f) => ({
                value: f._id,
                label: f.name,
              }))
            : [],
          col: [12, 12],
          labelPlacement: 'top',
          radioProps: {
            row: true,
          },
        },
        {
          key: 'scale_id',
          label: 'Quy mô kinh doanh của bạn là:',
          type: 'radio',
          defaultValue: scale,
          option: props.initData.scale
            ? props.initData.scale.map((s) => ({
                value: s._id,
                label: s.name,
              }))
            : [],
          col: [12, 12],
          labelPlacement: 'top',
          radioProps: {
            row: true,
          },
        },
        ...listSubData,
      ];
      return newData;
    })()
  );

  const { errors, control, handleSubmit, getValues, setValue } = useForm(() => {
    return {
      defaultValues: {
        ...newDataRef.current.reduce(
          (currentObj, { key, defaultValue }) => ({
            ...currentObj,
            [key]: defaultValue || '',
          }),
          {}
        ),
      },
    };
  });

  return (
    <Box component={Paper} p={2}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {newDataRef.current.map((input, index) => (
            <>
              <Grid
                item
                xs={input.col[0]}
                md={input.col[1]}
                key={`profile_${index}`}>
                <InputWrapper
                  helperText={
                    errors[input.key]
                      ? `${
                          errors[input.key].message || 'This field is required'
                        }`
                      : ''
                  }
                  error={!!errors[input.key] || undefined}
                  variant='outlined'
                  margin='dense'
                  label={input.label}
                  subLabel={input.subLabel}
                  type={input.type || 'text'}
                  fullWidth
                  name={input.key}
                  control={control}
                  rules={input.rules ? { ...input.rules } : undefined}
                  disabled={!!input.disabled}
                  defaultValue={input.defaultValue || ''}
                  labelPlacement={input.labelPlacement}
                  option={input.option}
                  radioProps={input.radioProps}
                />
              </Grid>
              {input.key === 'phone_number' && (
                <>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={props.initData.addressSampleData}
                      freeSolo
                      getOptionLabel={(option) => option.name || ''}
                      id='city'
                      name='city'
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin='dense'
                          label='Tỉnh/Thành Phố'
                          variant='outlined'
                        />
                      )}
                      onChange={(event, newValue) => {
                        setSelectAddress({
                          selectedCity: newValue,
                          selectedDistrict: null,
                          selectedWard: null,
                        });
                      }}
                      value={selectAddress?.selectedCity || null}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      freeSolo
                      id='district'
                      name='district'
                      options={selectAddress?.selectedCity?.districts || []}
                      getOptionLabel={(option) => option?.name || ''}
                      onChange={(event, newValue) => {
                        setSelectAddress({
                          ...selectAddress,
                          selectedWard: null,
                          selectedDistrict: newValue,
                        });
                      }}
                      value={selectAddress?.selectedDistrict || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin='dense'
                          label='Quận huyện'
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      freeSolo
                      id='ward'
                      name='ward'
                      options={selectAddress?.selectedDistrict?.wards || []}
                      getOptionLabel={(option) => option?.name || ''}
                      onChange={(event, newValue) => {
                        setSelectAddress({
                          ...selectAddress,
                          selectedWard: newValue,
                        });
                      }}
                      value={selectAddress?.selectedWard || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin='dense'
                          label='Phường Xã'
                          variant='outlined'
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
            </>
          ))}

          <Grid container item xs={12} justifyContent='center'>
            <Grid item xs={3}>
              <Box width='100%'>
                <Button
                  fullWidth
                  type='submit'
                  color='primary'
                  variant='contained'>
                  Lưu
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
