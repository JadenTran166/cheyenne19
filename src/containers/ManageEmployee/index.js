import {
  Box,
  Button,
  Paper,
  Typography,
  makeStyles,
  Grid,
  Select,
  MenuItem,
} from '@material-ui/core';
import React, { useState, useEffect, useRef } from 'react';
import CommonTable from 'components/CommonTable';
import axiosService from 'config/axiosService';
import { Alert, formatDateTime } from 'utils/index';
import CommonModal from 'components/CommonModal';
import { useForm } from 'react-hook-form';
import InputWrapper from 'components/InputWrapper';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { useParams } from 'react-router';
import useCustomHistory from 'hooks/useCustomHistory';
const useStyles = makeStyles((theme) => ({}));
const ManageEmployee = () => {
  const classes = useStyles();
  const userData = useSelector((state) => state.user.userData);
  const params = useParams();
  const { goTo } = useCustomHistory();

  const tableRef = useRef();

  const provincesList = useSelector((state) => state.global.initData.provinces);
  const roleList = useSelector((state) => state.global.initData.roles);

  const [options, setOptions] = useState({
    headerStyle: {
      fontWeight: 'bold',
    },
    searchFieldVariant: 'outlined',
    searchFieldStyle: {
      width: '100%',
    },
    grouping: false,
    showTextRowsSelected: false,
    showSelectAllCheckbox: false,
    searchFieldAlignment: 'left',
    showTitle: false,
    filtering: false,
  });

  const [columns, setColumns] = useState([
    {
      title: 'Mã',
      field: '_id',
      filtering: false,
      sorting: false,
      render: (data) => {
        return data._id.slice(-6);
      },
    },
    {
      title: 'Họ & tên',
      field: 'name',
      filtering: false,
      // sorting: false,
      render: (data) => {
        return `${data.first_name ? data.first_name + ' ' : ''}${
          data.name || ''
        }`;
      },
    },
    { title: 'Email', field: 'email', filtering: false },
    {
      title: 'Số điện thoại',
      field: 'local_phone_number',
      filtering: false,
      sorting: false,
    },
    {
      filterKey: 'position',
      title: 'Chức vụ',
      field: 'position.name',
      sortKey: 'position',
      lookup: {
        owner: 'Chủ sở hữu',
        manager: 'Quản lý',
        employee: 'Nhân viên',
      },
      filterComponent: (filterProps) => {
        const { lookup, tableData } = filterProps.columnDef;
        return (
          <Select
            fullWidth
            // labelId='demo-simple-select-standard-label'
            // id='demo-simple-select-standard'
            // value={age}
            defaultValue='all'
            onChange={(event) => {
              filterProps.onFilterChanged(
                tableData.columnOrder,
                event.target.value
              );
            }}
            margin='dense'>
            <MenuItem value='all'>Tất cả</MenuItem>
            {Object.entries(lookup).map(([key, value]) => (
              <MenuItem value={key}>{value}</MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Trạng thái',
      field: 'active',
      lookup: { true: 'Kích  hoạt', false: 'Bị khóa' },
      filterComponent: (filterProps) => {
        const { lookup, tableData } = filterProps.columnDef;
        return (
          <Select
            fullWidth
            // labelId='demo-simple-select-standard-label'
            // id='demo-simple-select-standard'
            // value={age}
            defaultValue='all'
            onChange={(event) => {
              filterProps.onFilterChanged(
                tableData.columnOrder,
                event.target.value
              );
            }}
            margin='dense'>
            <MenuItem value='all'>Tất cả</MenuItem>
            {Object.entries(lookup).map(([key, value]) => (
              <MenuItem value={key}>{value}</MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Ngày tạo',
      field: 'created_at',
      filtering: false,
      defaultSort: 'asc',
      render: (data) => {
        return formatDateTime(data.created_at);
      },
    },
    {
      title: 'Hành động',
      field: 'action',
      sorting: false,
      filtering: false,
      align: 'center',
      render: (data) => {
        return (
          <Box display='inline-flex'>
            <Button
              onClick={() => {
                toggleActive(data);
              }}
              disabled={
                data?.position?.name === 'owner' ||
                (data?.position?.name === 'manager' &&
                  userData.role !== 'owner')
              }>
              <Box
                width='80px'
                component='span'
                color={
                  data?.position?.name === 'owner' ||
                  (data?.position?.name === 'manager' &&
                    userData.role !== 'owner')
                    ? ''
                    : data.active
                    ? 'error.main'
                    : 'success.main'
                }
                whiteSpace='noWrap'>
                {data.active ? 'Khóa' : 'Mở khóa'}
              </Box>
            </Button>

            <Button
              onClick={() => {
                setItemEdit(data);
              }}
              disabled={
                (data?.position?.name === 'owner' &&
                  userData.role !== 'owner') ||
                (data?.email !== userData.email &&
                  data?.position?.name === 'manager' &&
                  userData.role !== 'owner')
              }>
              <Box
                component='span'
                color={
                  (data?.position?.name === 'owner' &&
                    userData.role !== 'owner') ||
                  (data?.email !== userData.email &&
                    data?.position?.name === 'manager' &&
                    userData.role !== 'owner')
                    ? ''
                    : '#0B86D0'
                }
                whiteSpace='noWrap'>
                Chỉnh sửa
              </Box>
            </Button>
          </Box>
        );
      },
    },
  ]);

  const [itemEdit, setItemEdit] = useState(null);

  const [isOpenCreateEmployee, setIsOpenCreateEmployee] = useState(false);

  const [globalError, setGlobalError] = useState('');

  const [mapInput, setMapInput] = useState([
    {
      key: 'first_name',
      label: 'Họ',
      type: 'text',
      defaultValue: '',
      col: [6, 4],
    },
    {
      key: 'last_name',
      label: 'Tên',
      type: 'text',
      defaultValue: '',
      col: [6, 4],
      rules: {
        required: true,
      },
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      defaultValue: '',
      col: [6, 4],
      rules: {
        required: true,
        pattern: {
          value: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
          message: 'Email không đúng định dạng.',
        },
      },
    },
    {
      key: 'local_phone_number',
      label: 'Số điện thoại',
      type: 'text',
      defaultValue: '',
      col: [6, 4],
      rules: {
        minLength: { value: 10, message: 'Tối thiểu 10 số' },
        maxLength: { value: 12, message: 'Tối đa 12 số' },
        // pattern: {
        //   value: /(\+84|03|05|07|08|09|01[2|6|8|9])+([0-9]{8,9})\b/,
        //   message: 'Số điện thoại không đúng định dạng',
        // },
        validate: {
          checkPhone: (value = '') => {
            value = value?.trim();
            if (
              value &&
              value.startsWith('+84') &&
              !/(\+84)+([0-9]{9})\b/.test(value)
            ) {
              return 'Số điện thoại không đúng định dạng';
            } else {
              return true;
            }
          },
          checkPhone2: (value = '') => {
            value = value?.trim();
            if (
              value &&
              !value.startsWith('+84') &&
              !/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)
            ) {
              return 'Số điện thoại không đúng định dạng';
            } else {
              return true;
            }
          },
        },
      },
    },
    {
      key: 'password',
      label: 'Mật khẩu',
      type: 'password',
      defaultValue: '',
      col: [6, 4],
      rules: {
        minLength: { value: 6, message: 'Tối thiểu 6 ký tự' },
        required: true,
      },
    },
    {
      key: 're_password',
      label: 'Nhập lại mật khẩu',
      type: 'password',
      defaultValue: '',
      col: [6, 4],
      rules: {
        validate: {
          checkSamePw: (value) => {
            return value === getValues('password')
              ? true
              : 'Mật khẩu không trùng khớp';
          },
        },
        required: true,
      },
    },
    {
      key: 'provinces',
      label: 'Tỉnh thành',
      type: 'select_and_autocomplete',
      defaultValue: '',
      option: provincesList.map((item) => ({
        value: item.code,
        label: item.name,
      })),
      col: [6, 4],
    },
    {
      key: 'districts',
      label: 'Quận huyện',
      type: 'select_and_autocomplete',
      defaultValue: '',
      option: [],
      col: [6, 4],
    },
    {
      key: 'wards',
      label: 'Phường xã',
      type: 'select_and_autocomplete',
      defaultValue: '',
      option: [],
      col: [6, 4],
    },
    {
      key: 'address',
      label: 'Tên đường',
      type: 'text',
      defaultValue: '',
      col: [6, 4],
    },
    {
      key: 'role',
      label: 'Chức vụ',
      type: 'select',
      defaultValue: 'employee',
      option: [
        {
          value: 'employee',
          label: 'Nhân viên',
        },
        {
          value: 'manager',
          label: 'Quản lý',
          disabled: userData.role !== 'owner',
        },
        {
          value: 'owner',
          label: 'Chủ sở hữu',
          disabled: true,
        },
      ],
      col: [6, 4],
      rules: {
        required: true,
      },
    },
    {
      key: 'active',
      label: 'Trạng thái',
      type: 'switch',
      defaultValue: false,
      col: [12, 4],
      labelPlacement: 'start',
      isVertical: true,
    },
  ]);

  const { errors, control, handleSubmit, getValues, setValue, watch, reset } =
    useForm(() => {
      return {
        defaultValues: {
          ...mapInput.reduce(
            (currentObj, { key, defaultValue }) => ({
              ...currentObj,
              [key]: defaultValue || '',
            }),
            {}
          ),
        },
      };
    });
  const { provinces, districts } = watch([
    'provinces',
    'districts',
    // 'wards',
  ]);

  function onSubmitEmployee(data) {
    const {
      first_name,
      email,
      last_name,
      districts,
      provinces,
      wards,
      role,
      local_phone_number,
      password,
      address,
      active,
    } = data;

    const positionId = roleList.find((item) => item.name === role)?._id;
    const bodyData = {
      first_name: first_name || '',
      last_name,
      password,
      email,
      phone_number: local_phone_number || '',
      active,
      position: positionId,
      address: {
        province_code: districts?.value || '',
        state_code: provinces?.value || '',
        street: address || '',
        ward_code: wards?.value || '',
      },
    };
    // if (_.isEmpty(_.omitBy(bodyData.address, _.isNil))) {
    //   delete bodyData.address;
    // }

    if (itemEdit) {
      axiosService
        .patch('/site-users/' + itemEdit._id, bodyData)
        .then((res) => {
          setItemEdit(null);
          tableRef.current && tableRef.current.onQueryChange();

          Alert.fire({
            icon: 'success',
            title: 'Cập nhật nhân viên thành công.',
            showConfirmButton: false,
          });
        })
        .catch((e) => {
          const { message } = e.response?.data || {};
          Alert.fire({
            icon: 'error',
            title:
              message ||
              'Cập nhật nhân viên không thành công, vui lòng thử lại sau',
            showConfirmButton: false,
          });
        });
    } else {
      axiosService
        .post('/site-users', bodyData)
        .then((res) => {
          tableRef.current && tableRef.current.onQueryChange();
          reset({
            first_name: '',
            email: '',
            last_name: '',
            districts: '',
            provinces: '',
            wards: '',
            role: 'employee',
            local_phone_number: '',
            address: '',
            active: false,
          });
          setIsOpenCreateEmployee(false);
          Alert.fire({
            icon: 'success',
            title: 'Tạo nhân viên thành công.',
            showConfirmButton: false,
          });
        })
        .catch((e) => {
          const { message } = e.response?.data || {};
          Alert.fire({
            icon: 'error',
            title:
              message || 'Tạo nhân viên không thành công, vui lòng thử lại sau',
            showConfirmButton: false,
          });
        });
    }
  }

  function toggleActive(data) {
    axiosService
      .patch('/site-users/' + data._id, {
        active: !data.active,
      })
      .then((res) => {
        Alert.fire({
          icon: 'success',
          title: `${!data.active ? 'Mở khóa' : 'Khóa'} nhân viên thành công.`,
          showConfirmButton: false,
        });

        tableRef.current && tableRef.current.onQueryChange();
      })
      .catch((e) => {
        const { message } = e.response?.data || {};
        Alert.fire({
          icon: 'error',
          title:
            message ||
            'Cập nhật nhân viên không thành công, vui lòng thử lại sau',
          showConfirmButton: false,
        });
      });
  }

  const searchData = _.debounce((value) => {
    tableRef.current &&
      tableRef.current.onQueryChange({
        // filters: [],
        // orderBy: undefined,
        // orderDirection: '',
        page: 0,
        // pageSize: 5,
        search: value,
      });
  }, 300);

  function toggleFilter() {
    const x = tableRef.current?.dataManager.pageSize;
    if (options.filtering) {
      tableRef.current &&
        tableRef.current.onQueryChange({
          // pageSize: x,
          filters: [],
        });
    }

    setOptions((state) => ({
      ...state,
      filtering: !state.filtering,
    }));
  }

  useEffect(() => {
    if (itemEdit) {
      const {
        first_name = '',
        email = '',
        name = '',
        position = '',
        local_phone_number = '',
        address = '',
        active = false,
      } = itemEdit;

      const {
        province_code = '',
        state_code = '',
        ward_code = '',
        street = '',
      } = address || {};

      let districts = '',
        provinces = '',
        wards = '';

      if (state_code) {
        const getProvinces =
          provincesList.find((item) => item.code === state_code) || {};

        provinces = {
          value: getProvinces.code,
          label: getProvinces.name,
        };
        if (province_code && getProvinces.districts) {
          const getDistrictByProvinces =
            getProvinces.districts.find(
              (item) => item.codename === province_code
            ) || {};

          districts = {
            value: getDistrictByProvinces.codename,
            label: getDistrictByProvinces.name,
          };
          if (ward_code && getDistrictByProvinces.wards) {
            let getWardByDistricts =
              getDistrictByProvinces.wards.find(
                (item) => item.codename === ward_code
              ) || {};

            wards = {
              value: getWardByDistricts.codename,
              label: getWardByDistricts.name,
            };
          }
        }
      }

      reset({
        first_name,
        email,
        last_name: name,
        // districts,
        provinces,
        active,
        // wards,
        role: position.name,
        local_phone_number,
        address: street,
      });
      // SetTimeout để cập nhật lần lượt từng field vì cập nhật cùng 1 lúc không được do useEffect :)))
      if (districts) {
        setTimeout(() => {
          setValue('districts', districts);
          if (wards) {
            setTimeout(() => {
              setValue('wards', wards);
            }, 0);
          }
        }, 0);
      }
    } else {
      reset({
        first_name: '',
        email: '',
        last_name: '',
        districts: '',
        provinces: '',
        wards: '',
        role: 'employee',
        local_phone_number: '',
        address: '',
        active: false,
      });
      if (params?.id) {
        goTo('employee');
      }
    }
  }, [itemEdit]);

  useEffect(() => {
    const selectProvinces = getValues('provinces');

    if (selectProvinces?.value) {
      const currentMapInput = mapInput.map((item) => {
        if (item.key === 'districts') {
          item.option =
            provincesList
              .find((item) => item.code === selectProvinces?.value)
              ?.districts?.map((item) => ({
                value: item.codename,
                label: item.name,
              })) || [];
        }
        return { ...item };
      });

      setMapInput([...currentMapInput]);
    } else {
      const currentMapInput = mapInput.map((item) => {
        if (item.key === 'districts') {
          item.option = [];
        }
        return { ...item };
      });

      setMapInput([...currentMapInput]);
    }
    setValue('districts', '');
    setValue('wards', '');
  }, [provinces]);

  useEffect(() => {
    const selectProvinces = getValues('provinces');
    const selectDistricts = getValues('districts');

    if (selectProvinces?.value && selectDistricts?.value) {
      const currentMapInput = mapInput.map((item) => {
        if (item.key === 'wards') {
          const getDistrictByProvinces =
            provincesList.find((item) => item.code === selectProvinces?.value)
              ?.districts || [];
          const getWardByDistricts =
            getDistrictByProvinces
              .find((item) => item.codename === selectDistricts?.value)
              ?.wards.map((item) => ({
                value: item.codename,
                label: item.name,
              })) || [];
          item.option = getWardByDistricts;
        }
        return { ...item };
      });

      setMapInput([...currentMapInput]);
    } else {
      const currentMapInput = mapInput.map((item) => {
        if (item.key === 'wards') {
          item.option = [];
        }
        return { ...item };
      });

      setMapInput([...currentMapInput]);
    }

    setValue('wards', '');
  }, [districts]);

  useEffect(() => {
    if (params?.id) {
      axiosService.get(`/site-users/${params.id}`).then((res) => {
        setItemEdit(res.data);
      });
    }
  }, []);

  const isEdit = !!itemEdit;

  return (
    <Box mt={4}>
      <Box component={Paper}>
        <Box p={2} display='flex' justifyContent='space-between'>
          <Typography variant='h6'>
            <Box
              fontWeight='bold'
              component='div'
              style={{ textTransform: 'uppercase' }}>
              Quản lý nhân viên
            </Box>
          </Typography>

          <Box display='flex' alignItems='center'>
            <Box ml={1} clone height='43px'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => setIsOpenCreateEmployee(true)}>
                Tạo nhân viên
              </Button>
            </Box>
          </Box>
        </Box>
        <CommonTable
          tableRef={tableRef}
          options={options}
          // data={employeeData}
          data={(query) => {
            return new Promise((resolve, reject) => {
              const {
                page,
                pageSize,
                search,
                filters,
                orderBy,
                orderDirection,
              } = query;
              // prepare your data and then call resolve like this:
              let bodyData = {
                offset: page ? page * pageSize : page,
                limit: pageSize,
                filters: [],
                search: search?.trim() || '',
                // [`sort[][${sortKey}]`]: 'asc',
              };

              if (orderBy) {
                bodyData[`sort[][${orderBy.sortKey || orderBy.field}]`] =
                  orderDirection;
              }

              if (filters?.length) {
                filters.forEach((item) => {
                  if (item.value !== 'all') {
                    if (item.column.filterKey === 'position') {
                      item.value = roleList.find(
                        (roleItem) =>
                          roleItem.name === item.column.tableData.filterValue
                      )?._id;
                    }

                    let customKey = '';

                    if (
                      item.column.filterKey === 'active' ||
                      item.column.field === 'active'
                    ) {
                      customKey = 'is_active';
                    }

                    bodyData.filters.push({
                      filter_type:
                        customKey || item.column.filterKey || item.column.field,
                      value: item.value,
                    });
                  }
                });
              }

              axiosService
                .get('/site-users', bodyData)
                .then((res) => {
                  resolve({
                    data: res.data.site_users,
                    page,
                    totalCount: res.data.paging.total,
                  });
                })
                .catch((e) => {
                  reject(new Error('Lỗi hệ thống'));
                });
            });
          }}
          columns={columns}
          localization={{
            body: {
              emptyDataSourceMessage: 'Không có dữ liệu',
            },
          }}
          handleSearchChange={searchData}
          toggleFilter={toggleFilter}
          isFilterButton
        />
      </Box>
      <CommonModal
        isOpen={isOpenCreateEmployee || isEdit}
        handleClose={() => {
          setIsOpenCreateEmployee(null);
          setItemEdit(null);
        }}
        isCloseBtn
        fullWidth={false}>
        <Box component={Paper} p={2} maxWidth='700px'>
          <form onSubmit={handleSubmit(onSubmitEmployee)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h5'>
                  {isEdit
                    ? `Cập nhật nhân viên #${itemEdit._id.slice(-6)}`
                    : 'Tạo nhân viên'}
                </Typography>
              </Grid>
              {mapInput.map((input, index) => {
                const listHidden = ['active'];
                const listHiddenEdit = ['password', 're_password'];
                if (isEdit && listHiddenEdit.includes(input.key)) {
                  return <div key={`profile_${index}`}></div>;
                }

                if (!isEdit && listHidden.includes(input.key)) {
                  return <div key={`profile_${index}`}></div>;
                }

                const listCheck =
                  userData.role === 'owner' ? ['owner'] : ['owner', 'manager'];
                const isCustomOptionRole = isEdit && input.key === 'role';
                // listCheck.includes(itemEdit?.position?.name);
                let customOption = [];
                if (isCustomOptionRole) {
                  input.option.forEach((item) => {
                    switch (itemEdit?.position?.name) {
                      case 'owner':
                        customOption.push({
                          ...item,
                          // disabled: !(item.value === 'owner'),
                        });
                        break;
                      case 'manager':
                        customOption.push({
                          ...item,
                          disabled: listCheck.includes(item.value),
                        });
                        break;
                      case 'employee':
                        customOption.push({
                          ...item,
                          disabled:
                            item.value === 'owner' ||
                            (userData.role !== 'owner' &&
                              item.value !== 'employee'),
                        });
                        break;

                      default:
                        break;
                    }
                  });
                }

                let customDisable = false;
                let listDisableEdit = ['email', 'local_phone_number'];
                let listDisableSelfEdit = ['active', 'role'];
                if (
                  (isEdit &&
                    listDisableEdit.includes(input.key) &&
                    itemEdit[input.key]) ||
                  (listDisableSelfEdit.includes(input.key) &&
                    itemEdit?.email === userData.email)
                ) {
                  customDisable = true;
                }

                return (
                  <Grid
                    item
                    // xs={input.col[0]}
                    md={input.col[0]}
                    key={`profile_${index}`}>
                    <InputWrapper
                      helperText={
                        errors[input.key]
                          ? errors[input.key].type === 'required'
                            ? 'Vui lòng không bỏ trống'
                            : `${errors[input.key].message}`
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
                      disabled={!!input.disabled || customDisable}
                      defaultValue={input.defaultValue || ''}
                      labelPlacement={input.labelPlacement}
                      option={isCustomOptionRole ? customOption : input.option}
                      radioProps={input.radioProps}
                      isVertical={input.isVertical}
                    />
                  </Grid>
                );
              })}
              <Grid item>
                <Box clone color='error.main'>
                  <Typography>{globalError}</Typography>
                </Box>
              </Grid>
              <Grid container item xs={12} justifyContent='center'>
                <Box width='50%'>
                  <Button
                    fullWidth
                    type='submit'
                    color='primary'
                    variant='contained'>
                    {isEdit ? 'Cập nhật' : 'Tạo nhân viên'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </CommonModal>
    </Box>
  );
};

export default ManageEmployee;
