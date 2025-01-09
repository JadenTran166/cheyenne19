import DateFnsUtils from '@date-io/date-fns';
import { Box, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import CommonTable from 'components/CommonTable';
import { listRouteByKey } from 'config/configureRoute';
import 'date-fns';
import useQuery from 'hooks/useQuery';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import CommonModal from '../../components/CommonModal';
import { formatCurrencyVnd, orderStatusColor } from '../../constants/common';
import EditOrder from './EditOrder';

const useStyles = makeStyles((theme) => ({
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
  ...Object.keys(orderStatusColor).reduce(
    (rs, item) => ({
      ...rs,
      [item]: {
        '&.MuiTypography-colorPrimary': {
          color: orderStatusColor[item].color,
        },
      },
    }),
    {}
  ),
}));

function RightManageOrder(props) {
  const classes = useStyles();
  const { data, fromDate, toDate, handleSelectDate } = props;

  const provinceList = useSelector((state) => state.global.initData.provinces);

  const [itemEdit, setItemEdit] = useState(null);
  const params = useParams();

  const history = useHistory();

  let query = useQuery();

  const [options, setOptions] = useState(() => {
    const filterKey = query.get('filter');
    let defaultFiltering = false;
    if (filterKey && Object.keys(data.lookupOrderStatus).includes(filterKey)) {
      defaultFiltering = true;
    }

    return {
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
      filtering: defaultFiltering,
    };
  });

  const [columns] = useState(() => {
    const filterKey = query.get('filter');
    let defaultFilterStatus = [];
    if (filterKey && Object.keys(data.lookupOrderStatus).includes(filterKey)) {
      defaultFilterStatus.push(filterKey);
    }

    return [
      {
        title: 'Mã đơn',
        field: 'id',
        filtering: false,
        render: (data) => {
          return data._id.slice(-6);
        },
      },
      { title: 'Tên khách hàng', field: 'user.name', filtering: false },
      {
        title: 'Trạng thái',
        field: 'status',
        lookup: data.lookupOrderStatus,
        render: (rowData) => {
          return (
            <Typography
              variant='body2'
              className={classes[rowData.status]}
              color='primary'>
              {data.orderStatus[rowData.status].description}
            </Typography>
          );
        },
        defaultFilter: defaultFilterStatus,
      },
      {
        title: 'Ngày lên đơn',
        filtering: false,
        field: 'deal_start',

        render: (rowData) => moment(rowData.deal_start).format('DD/MM/YYYY'),
      },
      {
        title: 'Tổng tiền',
        filtering: false,

        customSort: (a, b) => {
          return getAllPrice(a.order) - getAllPrice(b.order);
        },
        render: (rowData) => formatCurrencyVnd(getAllPrice(rowData.order)),
      },
      {
        title: 'Hành động',
        field: 'action',
        sorting: false,
        filtering: false,
        render: (data) => {
          return (
            <Box display='inline-flex'>
              <Button
                onClick={() => {
                  setItemEdit({ ...data });
                }}>
                <Box component='span' color='#0B86D0' whiteSpace='noWrap'>
                  Xem
                </Box>
              </Button>
            </Box>
          );
        },
      },
    ];
  });
  useEffect(() => {
    const orderId = params?.id;
    if (orderId && data?.order_in_site?.length > 0) {
      const index = data.order_in_site.findIndex(
        (item) => item._id === orderId
      );
      if (index < 0) return;

      setItemEdit({ ...data.order_in_site[index] });
    }
  }, [data?.order_in_site?.length]);
  const handleChangeFromDate = (date) => {
    const changedDate = new Date(date).valueOf();
    if (changedDate > toDate) {
      Swal.fire({
        title: `Ngày bắt đầu không thể lớn hơn ngày kết thúc`,
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      handleSelectDate(fromDate);
      return;
    }
    handleSelectDate(changedDate);
  };
  const handleChangeToDate = (date) => {
    const changedDate = new Date(date).valueOf();
    handleSelectDate(null, changedDate);
  };

  function getAllPrice(order) {
    if (order.length <= 0) return 0;
    return order.reduce((price, item) => price + item.quantity * item.price, 0);
  }

  function toggleFilter() {
    setOptions((state) => ({
      ...state,
      filtering: !state.filtering,
    }));
  }

  return (
    <Box component={Paper}>
      <Box p={2}>
        <Typography variant='h6'>
          <Box
            fontWeight='bold'
            component='div'
            style={{ textTransform: 'uppercase' }}>
            Danh sách đơn hàng
          </Box>
        </Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Box display='flex' justifyContent='space-between'>
            <KeyboardDatePicker
              disableToolbar
              variant='inline'
              format='MM/dd/yyyy'
              margin='normal'
              id='date-picker-inline'
              label='Từ ngày'
              value={fromDate}
              onChange={handleChangeFromDate}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant='inline'
              format='MM/dd/yyyy'
              margin='normal'
              id='date-picker-inline'
              label='Đến ngày'
              value={toDate}
              onChange={handleChangeToDate}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Box>
        </MuiPickersUtilsProvider>
      </Box>
      <CommonTable
        columns={columns}
        // isLoading={!data.order_in_site.length>0}
        data={data.order_in_site}
        title=''
        options={options}
        localization={{
          body: {
            emptyDataSourceMessage: 'Chưa có đơn hàng',
          },
          toolbar: {
            searchTooltip: 'Tìm kiếm',
            searchPlaceholder: 'Tìm kiếm',
          },
        }}
        toggleFilter={toggleFilter}
        isFilterButton
      />

      <CommonModal
        isOpen={!!itemEdit}
        handleClose={() => {
          setItemEdit(null);
          if (params.id) {
            history.push(listRouteByKey.customer_order.pathDynamic);
          }
        }}
        maxWidth='lg'>
        <EditOrder
          data={itemEdit}
          initData={data}
          setItemEdit={setItemEdit}
          provinceList={provinceList}
          handleClose={() => {
            setItemEdit(null);
            if (params.id) {
              history.push(listRouteByKey.customer_order.pathDynamic);
            }
          }}
          handleRefeshData={props.getData}
        />
      </CommonModal>
    </Box>
  );
}

export default React.memo(RightManageOrder, (prevProp, nextProps) => {
  if (
    JSON.stringify(prevProp.data.order_in_site) ===
    JSON.stringify(nextProps.data.order_in_site)
  )
    return true;
  return false;
});
