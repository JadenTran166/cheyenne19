import {
  Box,
  Container,
  Grid,
  Paper,
  makeStyles,
  Typography,
  Button,
  Icon,
  Avatar,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import RectangleBox from 'components/RectangleBox/RectangleBox';
import axiosService from 'config/axiosService';
import {
  ASSETS_ENDPOINT,
  formatCurrencyVnd,
  USER_TYPE,
} from 'constants/common';
import useUserData from 'hooks/useUserData';
import { xor } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Alert } from 'utils';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import useCustomHistory from 'hooks/useCustomHistory';
import { useHistory } from 'react-router';
import { listRouteByKey } from 'config/configureRoute';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    // boxShadow: theme.shadows[1],
    maxWidth: 200,
    border: '0.2px solid #A29FA6;',
    fontSize: 11,
  },
  arrow: {
    backgroundColor: theme.palette.common.white,
  },
}))(Tooltip);

const mapDataOrder = [
  {
    name: 'pending',
    dataKey: 'totalOrderPending',
    description: 'Chờ xác nhận',
  },
  {
    name: 'packed',
    description: 'Đang soạn kho',
    dataKey: 'totalOrderPacked',
  },
  {
    name: 'shipping',
    description: 'Đang giao hàng',
    dataKey: 'totalOrderShipping',
  },
  {
    name: 'received',
    description: 'Thành công',
    dataKey: 'totalOrderReceived',
  },
  {
    name: 'canceled',
    description: 'Đã hủy',
    dataKey: 'totalOrderCanceled',
  },
];

const useStyles = makeStyles((theme) => {
  return {
    datePicker: {
      marginLeft: '10px',
      '& p': {
        marginLeft: ' 20px',
        minWidth: '230px',
      },
      '& .material-icons': {
        opacity: 0.6,
      },
    },
    title: {
      '& span': {
        color: theme.palette.grey[500],
      },
    },
    smallInfo: {
      textAlign: 'center',
      borderRight: '1px solid #d2d2d2',
      '&:last-child': {
        borderRight: '1px solid transparent',
      },
    },
    smallInfoValue: {
      color: '#0B86D0',
      fontWeight: 'bold',
    },
    boxOrderNumber: {
      cursor: 'pointer',
      '&:hover .MuiTypography-root.MuiTypography-body1': {
        color: '#0B86D0',
      },
    },
    circle: {
      height: '100px',
      width: '100px',
      borderRadius: '999px',
      margin: '10px auto',
      border: '2px solid #0B86D0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    showDetailBtn: {
      color: '#0B86D0',
      cursor: 'pointer',
      fontSize: '14px',
    },
    customImg: {
      width: '34px',
      height: '34px',
    },
  };
});

const OrderNumber = (props) => {
  const { title, value, dataKey } = props;
  const classes = useStyles();
  const { goTo } = useCustomHistory();
  return (
    <Grid sm={12} md item className={classes.smallInfo}>
      <Box
        className={classes.boxOrderNumber}
        onClick={() => {
          goTo('customer_order', `?filter=${dataKey}`);
        }}>
        <Typography
          component='span'
          variant='subtitle1'
          className={classes.smallInfoValue}>
          {value}
        </Typography>
        <Typography>{title}</Typography>
      </Box>
    </Grid>
  );
};

export default function Dashboard() {
  const classes = useStyles();
  const { userData } = useUserData();
  const isRetail = userData.seller_type === USER_TYPE.RETAIL;

  const { goTo } = useCustomHistory();
  const history = useHistory();

  const defaultDatePickerStart = moment().startOf('month');
  const defaultDatePickerEnd = moment().endOf('month');
  const [statisticalInformation, setStatisticalInformation] = useState({});
  const [selectedRange, setSelectedRange] = React.useState({
    chosenLabel: 'Tháng này',
    startDate: defaultDatePickerStart.unix() * 1000,
    endDate: defaultDatePickerEnd.unix() * 1000,
  });

  const handleApplyDate = (e, picker) => {
    const { chosenLabel, startDate, endDate } = picker;

    setSelectedRange({
      chosenLabel,
      startDate: startDate.unix() * 1000,
      endDate: endDate.unix() * 1000,
      displayStartDate: startDate.format('MM-DD-YYYY'),
      displayEndDate: endDate.format('MM-DD-YYYY'),
    });
  };
  async function getData() {
    try {
      const data = await axiosService
        .get('/statistical-information/site', {
          startTime: selectedRange.startDate,
          endTime: selectedRange.endDate,
        })
        .then((res) => res.data);
      setStatisticalInformation(data.statisticalInformation);
    } catch (error) {
      Alert.fire({
        icon: 'error',
        title: "Can't get data. Try again.",
      });
    }
  }

  function renderNewEmployee() {
    return statisticalInformation.employees?.newEmployees?.map(
      (item, index) => (
        <Box
          key={`new_em_${index}`}
          mb={1}
          pb={1}
          display='flex'
          justifyContent='space-between'
          borderBottom={
            index === statisticalInformation.employees?.newEmployees?.length - 1
              ? ''
              : '1px solid #C4C4C4'
          }>
          <Box>
            <Avatar alt='' className={classes.customImg}>
              <Box fontSize='14px'>
                {item.name?.charAt(0) || item.first_name?.charAt(0) || ''}
              </Box>
            </Avatar>
          </Box>
          <Box flex='1' px={1}>
            <Typography variant='caption'>{`${
              item.first_name ? item.first_name + ' ' : ''
            } ${item.name}`}</Typography>
            <Box fontSize='12px'>
              {`${item.email}${
                item.email && item.local_phone_number ? ' - ' : ''
              }${item.local_phone_number || ''}`}
            </Box>
          </Box>
          <Typography
            onClick={() => {
              goTo('employee', {
                id: item._id,
              });
            }}
            component='span'
            className={classes.showDetailBtn}>
            Xem
          </Typography>
        </Box>
      )
    );
  }

  function renderNewClientConnect() {
    return statisticalInformation.connectedClients?.newClients?.map(
      (item, index) => (
        <Box
          mb={1}
          pb={1}
          display='flex'
          justifyContent='space-between'
          borderBottom={
            index ===
            statisticalInformation.connectedClients?.newClients.length - 1
              ? ''
              : '1px solid #C4C4C4'
          }>
          <Box>
            <Avatar
              alt=''
              className={classes.customImg}
              src={
                item.site_avatar ? `${ASSETS_ENDPOINT}${item.site_avatar}` : ''
              }>
              <Box fontSize='14px'>
                {item.name?.charAt(0) || item.first_name?.charAt(0) || ''}
              </Box>
            </Avatar>
          </Box>
          <Box flex='1' px={1}>
            <Typography variant='caption'>
              {isRetail
                ? `${item.first_name ? item.first_name + ' ' : ''}${item.name}`
                : item.siteName}
            </Typography>
            <Box fontSize='12px'>
              {`${item.email}${
                item.email && item.local_phone_number ? ' - ' : ''
              }${item.local_phone_number || ''}`}
            </Box>
          </Box>
          <Typography
            onClick={() => {
              history.push(
                `${listRouteByKey.manage_connected_site.path}/customer/${item.user_id}`
              );
            }}
            component='span'
            className={classes.showDetailBtn}>
            Xem
          </Typography>
        </Box>
      )
    );
  }

  function renderNewSiteConnect() {
    return statisticalInformation.connectedCompanies?.newCompanies?.map(
      (item, index) => (
        <Box
          mb={1}
          pb={1}
          display='flex'
          justifyContent='space-between'
          borderBottom={
            index ===
            statisticalInformation.connectedCompanies?.newCompanies.length - 1
              ? ''
              : '1px solid #C4C4C4'
          }>
          <Box>
            <Avatar
              alt=''
              className={classes.customImg}
              imgProps={{
                draggable: false,
              }}
              src={
                item.site_avatar ? `${ASSETS_ENDPOINT}${item.site_avatar}` : ''
              }>
              <Box fontSize='14px'>
                {item.name?.charAt(0) || item.first_name?.charAt(0) || ''}
              </Box>
            </Avatar>
          </Box>
          <Box flex='1' px={1}>
            <Typography variant='caption'>
              {item.siteName || 'Không rõ'}
            </Typography>
            <Box fontSize='12px'>
              {`${item.email}${
                item.email && item.local_phone_number ? ' - ' : ''
              }${item.local_phone_number || ''}`}
            </Box>
          </Box>
          <Typography
            onClick={() => {
              history.push(
                `${listRouteByKey.manage_connected_site.path}/${item.user_id}`
              );
            }}
            component='span'
            className={classes.showDetailBtn}>
            Xem
          </Typography>
        </Box>
      )
    );
  }

  // useEffect(() => {
  //   getData();
  // }, []);

  useEffect(() => {
    getData();
  }, [selectedRange]);
  return (
    <Box pb={4}>
      <Container>
        <Box component={Paper} elevation={3} padding={2} marginBottom={2}>
          {/* ACTIONS */}
          <Box display='flex' justifyContent='space-between'>
            <Box className={classes.title}>
              <Typography variant='h6'>Chỉ số quan trọng</Typography>
              <Typography variant='caption'>
                Thống kê sơ bộ về đơn hàng và doanh thu
              </Typography>
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <Typography>Khung thời gian: </Typography>
              <DateRangePicker
                onApply={handleApplyDate}
                initialSettings={{
                  startDate: defaultDatePickerStart,
                  endDate: defaultDatePickerEnd,
                  locale: {
                    format: 'YYYY-MM-DD',
                    customRangeLabel: 'Tùy chọn',
                    applyLabel: 'Áp dụng',
                    cancelLabel: 'Hủy',
                  },
                  ranges: {
                    'Hôm nay': [moment(), moment()],
                    'Hôm qua': [
                      moment().subtract(1, 'days'),
                      moment().subtract(1, 'days'),
                    ],
                    'Trong 7 ngày qua': [
                      moment().subtract(6, 'days'),
                      moment(),
                    ],
                    'Trong 30 ngày qua': [
                      moment().subtract(29, 'days'),
                      moment(),
                    ],
                    'Tháng này': [
                      moment().startOf('month'),
                      moment().endOf('month'),
                    ],
                    'Tháng trước': [
                      moment().subtract(1, 'month').startOf('month'),
                      moment().subtract(1, 'month').endOf('month'),
                    ],
                  },
                }}>
                <Button variant='outlined' className={classes.datePicker}>
                  <Icon>date_range</Icon>
                  <Typography variant='body1'>
                    {selectedRange.chosenLabel === 'Tùy chọn'
                      ? `Từ: ${selectedRange.displayStartDate} Đến: ${selectedRange.displayEndDate}`
                      : selectedRange.chosenLabel}
                  </Typography>
                </Button>
              </DateRangePicker>
            </Box>
          </Box>
          {/* CONTENT */}
          <Box marginY={5}>
            <Grid container spacing={5}>
              <Grid item md={6} sm={12}>
                <RectangleBox
                  title='Doanh thu'
                  content={formatCurrencyVnd(
                    statisticalInformation.order?.revenue || 0,
                    ' VNĐ'
                  )}
                />
              </Grid>
              <Grid item md={6} sm={12}>
                <RectangleBox
                  title='Tổng đơn'
                  content={statisticalInformation.order?.totalOrder || 0}
                  color='#0B86D0'
                />
              </Grid>
            </Grid>
          </Box>
          {statisticalInformation.order && (
            <Box marginBottom={5}>
              <Grid container spacing={5}>
                {mapDataOrder.map((data) => {
                  return (
                    <OrderNumber
                      key={data.name}
                      dataKey={data.name}
                      title={data.description}
                      value={statisticalInformation.order[data.dataKey] || 0}
                    />
                  );
                })}
              </Grid>
            </Box>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid item md={4} sm={12}>
            {/* Title */}
            <Box component={Paper} elevation={3} padding={2} height='100%'>
              <Box className={classes.title}>
                <Typography variant='h6'>Nhân viên</Typography>
                <Typography variant='body2'>
                  Tổng số nhân viên &#38; danh sách nhân viên mới
                </Typography>
              </Box>
              {/* CONTENT */}
              <Box className={classes.circle}>
                <Typography variant='h5'>
                  {statisticalInformation.employees?.total || 0}
                </Typography>
                <Typography variant='caption'>Nhân viên</Typography>
              </Box>
              <Box>
                <Typography variant='body2'>
                  <Box fontWeight='bold' component='span'>
                    Nhân viên mới
                  </Box>
                </Typography>
                <Box mt={2}>{renderNewEmployee()}</Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={4} sm={12}>
            <Box component={Paper} elevation={3} padding={2} height='100%'>
              <Box className={classes.title}>
                <Box display='flex' alignItems='center'>
                  <Typography variant='h6'>Khách hàng liên kết </Typography>
                  <Box ml={1} display='flex' alignItems='center'>
                    <LightTooltip
                      title={`Các ${
                        isRetail ? 'khách hàng' : 'công ty'
                      } đã liên kết để mua hàng của công ty mình`}
                      placement='top'
                      arrow
                      disableFocusListener>
                      <InfoOutlinedIcon color='disabled' fontSize='small' />
                    </LightTooltip>
                  </Box>
                </Box>
                <Typography variant='body2'>
                  Tổng số khách hàng &#38; khách hàng mới
                </Typography>
              </Box>
              <Box className={classes.circle}>
                <Typography variant='h5'>
                  {statisticalInformation.connectedClients?.total || 0}
                </Typography>
                <Typography variant='caption'>Công ty</Typography>
              </Box>
              <Box>
                <Typography variant='body2'>
                  <Box fontWeight='bold' component='span'>
                    Khách hàng mới
                  </Box>
                </Typography>
                <Box mt={2}>{renderNewClientConnect()}</Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={4} sm={12}>
            <Box component={Paper} elevation={3} padding={2} height='100%'>
              <Box className={classes.title}>
                <Box display='flex' alignItems='center'>
                  <Typography variant='h6'>Công ty liên kết </Typography>
                  <Box ml={1} display='flex' alignItems='center'>
                    <LightTooltip
                      title='Các công ty mình đã liên kết để mua hàng và nhập (copy) hàng'
                      placement='top'
                      arrow
                      disableFocusListener>
                      <InfoOutlinedIcon color='disabled' fontSize='small' />
                    </LightTooltip>
                  </Box>
                </Box>
                <Typography variant='body2'>
                  Tổng số công ty &#38; công ty đối tác mới
                </Typography>
              </Box>
              <Box className={classes.circle}>
                <Typography variant='h5'>
                  {statisticalInformation.connectedCompanies?.total}
                </Typography>
                <Typography variant='caption'>Công ty</Typography>
              </Box>
              <Box>
                <Typography variant='body2'>
                  <Box fontWeight='bold' component='span'>
                    Công ty đối tác mới
                  </Box>
                </Typography>
                <Box mt={2}>{renderNewSiteConnect()}</Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// test_admin_001@yopmail.com
