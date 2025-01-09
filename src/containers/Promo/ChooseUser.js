import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import InputWrapper from 'components/InputWrapper';
import axiosService from 'config/axiosService';
import { ENV_ASSETS_ENDPOINT } from 'env/local';
import MaterialTable, { MTableToolbar } from 'material-table';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { formatDate } from 'utils';
const useStyle = makeStyles((theme) => ({
  typoConnected: {
    color: '#2DCF58',
  },
  typoVip: {
    color: '#f20d0d',
  },
  customToolbar: {
    '& .MuiToolbar-root': {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(0, 2, 0, 2),
      '& .MuiTextField-root': {
        width: '100%',
      },
    },
  },
  logo: {
    boxSizing: 'border-box',
    border: '1px solid #E9EDEB',
    maxWidth: '100px',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
    },
  },
}));

const LIMIT_REQUEST = 9999;
const mapOption = [
  {
    key: 'all',
    label: 'Tất cả',
    type: 'checkbox',
    col: [6, 3],
  },
  {
    key: 'vip',
    label: 'Khách vip',
    type: 'checkbox',
    col: [6, 3],
  },
  {
    key: 'connected',
    label: 'Khách đã liên kết',
    type: 'checkbox',
    col: [6, 3],
  },
  {
    key: 'public',
    label: 'Khách lạ',
    type: 'checkbox',
    col: [6, 3],
  },
];

export default forwardRef(function ChooseUser(props, ref) {
  const [listUser, setListUser] = useState({
    connected: [],
    vip: [],
    both: [],
  });

  const classes = useStyle();

  const { errors, control, handleSubmit, getValues, setValue, watch } = useForm(
    {
      defaultValues: {
        all: false,
        connected: true,
        vip: true,
        public: false,
      },
    }
  );
  const { all, connected, vip, public: publicValue } = watch([
    'all',
    'connected',
    'vip',
    'public',
  ]);

  function getDataList() {
    axiosService
      .get(
        '/be-connected',
        {
          client: props.isRetail,
          page: 1,
          limit: LIMIT_REQUEST,
        },
        {}
      )
      .then((res) => {
        const { connected_site, be_connected_site } = res.data;
        const mapData = props.isRetail ? connected_site : be_connected_site;
        if (mapData?.length) {
          let result = {
            connected: [],
            vip: [],
            both: [],
          };
          mapData.forEach((user) => {
            const { status, is_vip } = user;
            if (status === 'accepted') {
              if (is_vip) {
                result.vip.push({ ...user });
              } else {
                result.connected.push({ ...user });
              }
              result.both.push({ ...user });
            }
          });
          setListUser(result);
          // setTotal(paging.total);
        }
      });
  }

  function updateUserChoose() {
    // tableData
    let filterChooseByUserType = [];
    Object.values(listUser).forEach((listItem) => {
      const result = listItem.filter((item) => {
        if (item.tableData?.checked) {
          if (
            (vip && item.is_vip) ||
            (connected && item.status === 'accepted' && !item.is_vip)
          )
            return true;
        }
        return false;
      });
      filterChooseByUserType = [...filterChooseByUserType, ...result];
    });
    props.setUserChoose(filterChooseByUserType);

    let userType = getValues();
    let resultUserType = [];
    for (const [key, value] of Object.entries(userType)) {
      if (value) {
        resultUserType.push(key);
      }
    }
    props.setUserTypeChoose(resultUserType);
  }

  function handleSelectRow(row, data) {
    // setListRowChoose(row);
    props.setUserChoose(row);
  }

  useEffect(() => {
    getDataList();
  }, []);

  function handleAllClick() {
    let currentValue = !getValues('all');

    if (props.isRetail) {
      setValue('public', currentValue);
    }
    setValue('connected', currentValue);
    setValue('vip', currentValue);
  }
  useEffect(() => {
    if (connected === vip && (vip === publicValue || !props.isRetail)) {
      setValue('all', connected);
    } else {
      setValue('all', false);
    }

    updateUserChoose();
  }, [connected, vip, publicValue]);
  function reMoutedData() {
    if (props.isRetail) {
      setValue('all', false);
    } else {
      setValue('all', true);
      props.setUserTypeChoose(['all', 'connected', 'vip']);
    }
    setValue('connected', true);
    setValue('vip', true);
    setValue('public', false);
    Object.values(listUser).forEach((listItem) => {
      listItem.forEach((item) => {
        if (item.tableData) {
          item.tableData.checked = false;
        }
      });
    });
    props.setUserChoose([]);
  }
  useImperativeHandle(ref, () => ({
    reMoutedData,
  }));
  return (
    <Box p={4}>
      <Paper elevation={2}>
        <Box p={2} mb={2}>
          <Typography variant='h6' gutterBottom>
            <Box fontWeight='bold' component='span'>
              Đối tượng khuyến mãi
            </Box>
          </Typography>
          <Grid container spacing={2}>
            {mapOption.map((item) => {
              if (!props.isRetail && item.key === 'public') {
                return '';
              }
              return (
                <Grid
                  item
                  xs={item.col[0]}
                  md={item.col[1]}
                  key={`choose_user_promo_${item.key}`}>
                  <InputWrapper
                    // variant='outlined'
                    label={item.label}
                    fullWidth
                    name={item.key}
                    control={control}
                    type={item.type}
                    isVertical
                    onClick={item.key === 'all' ? handleAllClick : undefined}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={2}>
        <Typography variant='h6'>
          <Box p={2} fontWeight='bold' component='div'>
            Chọn danh sách người dùng nhận thông báo
          </Box>
        </Typography>
        <MaterialTable
          data={
            vip && connected
              ? [...listUser.vip, ...listUser.connected]
              : vip
              ? listUser.vip
              : connected
              ? listUser.connected
              : []
          }
          columns={
            props.isRetail
              ? [
                  {
                    title: 'Mã khách hàng',
                    field: 'user._id',
                    render: (data) => {
                      return data.user._id.slice(-6);
                    },
                  },
                  { title: 'Tên', field: 'user.name' },
                  {
                    title: 'Trạng thái',
                    searchable: false,
                    render: (data) => {
                      return data.is_vip ? (
                        <Typography className={classes.typoVip} variant='body1'>
                          Khách hàng vip
                        </Typography>
                      ) : (
                        <Typography
                          className={classes.typoConnected}
                          variant='body1'>
                          Khách hàng đã liên kết
                        </Typography>
                      );
                    },
                  },
                ]
              : [
                  {
                    title: 'Mã site',
                    field: 'request_site._id',
                    render: (data) => {
                      return data.request_site?._id.slice(-6);
                    },
                  },
                  {
                    title: 'Ảnh Đại Diện',
                    field: 'logo',
                    render: (data) => {
                      return (
                        <Box className={classes.logo}>
                          <img
                            src={`${ENV_ASSETS_ENDPOINT}${data.request_site?.avatar}`}
                            alt={`${data.request_site?.name}`}
                          />
                        </Box>
                      );
                    },
                  },
                  { title: 'Tên site', field: 'request_site.name' },
                  {
                    title: 'Trạng thái',
                    searchable: false,
                    render: (data) => {
                      return data.is_vip ? (
                        <Typography className={classes.typoVip} variant='body1'>
                          Khách hàng vip
                        </Typography>
                      ) : (
                        <Typography
                          className={classes.typoConnected}
                          variant='body1'>
                          Khách hàng đã liên kết
                        </Typography>
                      );
                    },
                  },
                  {
                    title: 'Ngày Liên Kết',
                    field: 'connectedDate',
                    render: (data) => {
                      return (
                        <Typography>{formatDate(data.updated_at)}</Typography>
                      );
                    },
                  },
                ]
          }
          title=''
          options={{
            headerStyle: {
              fontWeight: 'bold',
            },
            searchFieldVariant: 'outlined',
            searchFieldStyle: {
              width: '100%',
            },
            grouping: false,
            showTextRowsSelected: false,
            showSelectAllCheckbox: true,
            searchFieldAlignment: 'left',
            showTitle: false,
            selection: true,
            selectionProps: (data) => {
              return {
                color: 'primary',
              };
            },
          }}
          onSelectionChange={handleSelectRow}
          components={{
            Toolbar: (props) => (
              <div className={classes.customToolbar}>
                <MTableToolbar
                  {...props}
                  showTextRowsSelected={false}
                  color='secondary'
                />
              </div>
            ),
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          localization={{
            body: {
              emptyDataSourceMessage: 'Chưa có khách hàng liên kết',
            },
            toolbar: {
              searchTooltip: 'Tìm kiếm',
              searchPlaceholder: 'Tìm kiếm',
            },
          }}
        />
      </Paper>
    </Box>
  );
});
