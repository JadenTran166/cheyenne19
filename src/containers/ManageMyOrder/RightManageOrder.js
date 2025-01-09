import { Box, Button, makeStyles, Paper, Typography } from '@material-ui/core';

import MaterialTable, { MTableToolbar } from 'material-table';
import React, { useEffect, useSelector, useState } from 'react';

import CommonModal from '../../components/CommonModal';

// import { Alert } from '../../utils';
import { formatCurrencyVnd, orderStatusColor } from '../../constants/common';
import moment from 'moment';
import EditOrder from './EditOrder';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2';
import CommonTable from 'components/CommonTable';
import { stringToSlug } from 'utils';

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
  const { data, handleSelectDate } = props;
  const [fromDate, setFromDate] = useState(
    new Date('2020-01-01'.replace(/-/g, '/')).valueOf()
  );
  const [toDate, setToDate] = useState(new Date().valueOf());
  const [itemEdit, setItemEdit] = useState(null);

  const location = useLocation();
  const params = useParams();

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

  const [columns, setColumns] = useState(() => {
    const { order_in_site } = data;
    const lookupSite = order_in_site.reduce((result, item) => {
      return {
        ...result,
        [item.site.id]: item.site.name,
      };
    }, {});
    return [
      {
        title: 'Mã đơn',
        field: 'id',
        filtering: false,
        render: (data) => {
          return data._id.slice(-6);
        },
      },
      { title: 'Tên công ty', lookup: lookupSite, field: 'site.id' },
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
              {data.orderStatus?.[rowData.status]?.description}
            </Typography>
          );
        },
      },
      {
        filtering: false,
        title: 'Ngày lên đơn',
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
        filtering: false,
        sorting: false,
        render: (data) => {
          return (
            <Box display='inline-flex'>
              <Button
                onClick={() => {
                  setItemEdit(data);
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
    if (location.pathname === '/order') return;
    const orderId = params?.id;
    if (orderId && data?.order_in_site?.length > 0) {
      const index = data.order_in_site.findIndex(
        (item) => item._id === orderId
      );
      if (index < 0) return;
      setItemEdit({ ...data.order_in_site[index] });
    }
  }, [data?.order_in_site?.length]);

  useEffect(() => {
    // setColumns();
  }, []);

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
      setFromDate(fromDate);
      handleSelectDate(fromDate);
      return;
    }
    setFromDate(changedDate);
    handleSelectDate(changedDate);
  };
  const handleChangeToDate = (date) => {
    const changedDate = new Date(date).valueOf();
    setToDate(changedDate);
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
            Danh sách đơn mua
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
        data={data.order_in_site}
        title=''
        options={options}
        localization={{
          body: {
            emptyDataSourceMessage: 'Chưa có sản phẩm',
          },
        }}
        toggleFilter={toggleFilter}
        isFilterButton
      />

      <CommonModal
        isOpen={!!itemEdit}
        handleClose={() => {
          setItemEdit(null);
        }}
        maxWidth='lg'>
        <EditOrder
          data={itemEdit}
          initData={data}
          setItemEdit={setItemEdit}
          handleClose={() => {
            setItemEdit(null);
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
