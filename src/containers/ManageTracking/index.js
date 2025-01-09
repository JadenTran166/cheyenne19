import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';
import axiosService from 'config/axiosService';
import { useSelector } from 'react-redux';
import { Alert, convertArrayToObject, formatDateTime } from 'utils';
import _ from 'lodash';
import CommonTable from 'components/CommonTable';
import {
  lookupRole,
  lookupTrackingAction,
  trackingActionColor,
} from 'constants/common';

import { formatCurrencyVnd } from 'constants/common';
import GroupSwitchLayout from './GroupSwitchLayout';

const useStyles = makeStyles((theme) => ({
  ...Object.keys(trackingActionColor).reduce(
    (rs, item) => ({
      ...rs,
      [item]: {
        '&.MuiTypography-colorPrimary': {
          color: trackingActionColor[item].color,
          fontWeight: 'bold',
        },
      },
    }),
    {}
  ),
}));

const ManageTracking = () => {
  const classes = useStyles();

  const tableRef = useRef();

  const userData = useSelector((state) => state.user.userData);

  const roleList = useSelector((state) => state.global.initData.roles);
  const orderStatusObj = useSelector((state) =>
    convertArrayToObject(state.global.initData.orderStatus, '_id')
  );

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
    pageSize: 30,
    pageSizeOptions: [10, 30, 50, 100],
    filtering: false,
  });

  const [columns, setColumns] = useState([
    {
      title: 'Họ & tên',
      field: 'name',
      filtering: false,
      // sorting: false,
      minWidth: '100px',
      render: (data) => {
        const { first_name, name } = data.site_user.user || {};

        return `${first_name || ''} ${name || ''}`;
      },
    },
    {
      title: 'Email',
      field: 'site_user.user.email',
      filtering: false,
      sortKey: 'email',
    },
    {
      filterKey: 'role',
      sortKey: 'role',
      title: 'Chức vụ',
      field: 'site_user.role.name',
      lookup: lookupRole,
      filterComponent: (filterProps) => {
        const { lookup, tableData } = filterProps.columnDef;
        return (
          <Select
            fullWidth
            defaultValue='all'
            onChange={(event) => {
              filterProps.onFilterChanged(
                tableData.columnOrder,
                event.target.value
              );
            }}
            margin='dense'>
            <MenuItem value='all'>Tất cả</MenuItem>
            {Object.entries(lookupRole).map(([key, value]) => (
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
      defaultSort: 'desc',
      render: (data) => {
        return formatDateTime(data.created_at);
      },
    },
    {
      title: 'Hoạt động',
      field: 'type',
      lookup: lookupTrackingAction,
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
      render: (data) => {
        return (
          <Typography
            variant='body2'
            className={classes[data.type]}
            color='primary'>
            {lookupTrackingAction[data.type]}
          </Typography>
        );
      },
    },
    {
      title: 'Chi tiết',
      field: 'created_at',
      filtering: false,
      minWidth: '400px',
      sorting: false,
      render: (data) => {
        return (
          <div dangerouslySetInnerHTML={{ __html: generateDetail(data) }}></div>
        );
      },
    },
  ]);

  const [itemEdit, setItemEdit] = useState(null);

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

  function genOrder({ idStatus, orderId, totalPrice }) {
    const { name } = orderStatusObj?.[idStatus] || {};
    let rawText = '';
    switch (name) {
      case 'confirmed':
        rawText = `Xác nhận đơn <strong>#[orderId]</strong>  giá trị <strong>[totalPrice]</strong>`;
        break;
      case 'packed':
        rawText = `Xác nhận đơn <strong>#[orderId]</strong>  giá trị <strong>[totalPrice]</strong> và chuyển đơn sang kho`;
        break;
      case 'shipping':
        rawText = `Đã chuyển <strong>#[orderId]</strong> cho đơn vị giao hàng`;
        break;
      case 'canceled':
        rawText = `Hủy đơn <strong>#[orderId]</strong>  giá trị <strong>[totalPrice]</strong>`;
        break;
      default:
        break;
    }

    return rawText
      .replace('[orderId]', orderId?.slice(-6) || 'chưa rõ')
      .replace('[totalPrice]', formatCurrencyVnd(totalPrice));
  }

  function genConnect(type, { name, status }) {
    let rawText = '';
    switch (type) {
      case 'create':
        rawText = `Gửi yêu cầu liên kết với công ty <strong>[name]</strong>`;
        break;
      case 'update':
        rawText = `Chấp nhận liên kết với khách hàng <strong>[name]</strong>`;
        break;
      case 'update_status':
        rawText = `Đã thay đổi mối quan hệ liên kết với công ty <strong>[name]</strong> sang <strong>[status]</strong>`;
        break;
      case 'delete':
        rawText = `Đã hủy liên kết với công ty <strong>[name]</strong>`;
        break;
      case 'delete_user':
        rawText = `Đã hủy liên kết với khách hàng <strong>[name]</strong>`;
        break;
      default:
        break;
    }

    return rawText.replace('[name]', name).replace('[status]', status);
  }

  function genCart(type, { productName, quantity }) {
    let rawText = '';
    switch (type) {
      case 'create':
        rawText = `Thêm sản phẩm <strong>[productName]</strong> vào giỏ hàng`;
        break;
      case 'update':
        rawText = `Thay đổi số lượng sản phẩm <strong>[productName]</strong> sang <strong>[quantity]</strong>`;
        break;
      case 'delete':
        rawText = `Xóa sản phẩm <strong>[productName]</strong> khỏi giỏ hàng `;
        break;
      default:
        break;
    }

    return rawText
      .replace('[productName]', productName)
      .replace('[quantity]', quantity);
  }

  function genEmployee(type, { id, email }) {
    let rawText = '';
    switch (type) {
      case 'create':
        rawText = `Đã tạo nhân viên <strong>#[id]</strong> - <strong>[email]</strong>`;
        break;
      case 'block':
        rawText = `Đã khóa nhân viên <strong>#[id]</strong> - <strong>[email]</strong>`;
        break;
      case 'active':
        rawText = `Đã kích hoạt lại nhân viên <strong>#[id]</strong> - <strong>[email]</strong>`;
        break;
      default:
        break;
    }

    return rawText
      .replace('[id]', id?.slice(-6) || 'chưa rõ')
      .replace('[email]', email);
  }

  function genBuyOrder(type, { orderId, totalPrice, idStatus }) {
    if (type === 'update') {
      type = orderStatusObj?.[idStatus]?.name || '';
    }

    let rawText = '';
    switch (type) {
      case 'create':
        rawText = `Đã gửi đơn mua <strong>#[orderId]</strong>  giá trị <strong>[totalPrice]</strong>`;
        break;
      case 'received':
        rawText = `Xác nhận đơn mua <strong>#[orderId]</strong>  giá trị <strong>[totalPrice]</strong> giao thành công`;
        break;
      case 'canceled':
        rawText = `Hủy đơn mua <strong>#[orderId]</strong>  giá trị <strong>[totalPrice]</strong>`;
        break;
      default:
        break;
    }

    return rawText
      .replace('[orderId]', orderId?.slice(-6) || 'chưa rõ')
      .replace('[totalPrice]', formatCurrencyVnd(totalPrice));
  }

  function getTotalPrice(order) {
    if (order.length <= 0) return 0;
    return order.reduce((price, item) => price + item.quantity * item.price, 0);
  }

  function generateDetail(data) {
    let detail = 'Chưa xác định';
    switch (data.type) {
      case 'order':
        detail = genOrder({
          idStatus: data.changed_fields?.to?.status,
          orderId: data.needed_fields?.id,
          totalPrice: data.needed_fields?.total_price,
        });
        break;
      case 'cart':
        let typeCart = data.action;
        let { name: productName, amount: quantity } = data.needed_fields;

        detail = genCart(typeCart, {
          quantity,
          productName,
        });
        break;
      case 'connect':
        const { changed_fields } = data;
        let type = data.action;
        let name = data.needed_fields?.name || 'chưa rõ';
        let status = '';

        if (
          type === 'update' &&
          _.isBoolean(changed_fields?.from?.is_vip) &&
          _.isBoolean(changed_fields?.to?.is_vip)
        ) {
          type = 'update_status';
          status = changed_fields?.to?.is_vip ? 'Vip' : 'Thường';
        }

        if (
          type === 'delete' &&
          changed_fields?.from?.accept_site === userData?.site?.id
        ) {
          type = 'delete_user';
        }

        detail = genConnect(type, { name, status });

        break;
      case 'employee':
        let typeEmpl = data.action;
        if (typeEmpl === 'update') {
          if (data.changed_fields?.to?.active) {
            typeEmpl = 'active';
          } else {
            typeEmpl = 'block';
          }
        }
        detail = genEmployee(typeEmpl, data.needed_fields);
        break;
      case 'buy_order':
        let typeBuyOrder = data.action;

        detail = genBuyOrder(typeBuyOrder, {
          orderId: data.needed_fields?.id,
          totalPrice: data.needed_fields?.total_price,
          idStatus: data.changed_fields?.to?.status,
        });
        break;
      // case 'memo':
      //   break;

      default:
        break;
    }
    return detail;
  }

  function toggleFilter() {
    if (options.filtering) {
      tableRef.current &&
        tableRef.current.onQueryChange({
          pageSize: tableRef.current?.dataManager.pageSize,
          filters: [],
        });
    }

    setOptions((state) => ({
      ...state,
      filtering: !state.filtering,
    }));
  }

  return (
    <Box mt={4} mb={2}>
      <GroupSwitchLayout />
      <Box component={Paper}>
        <Box p={2} display='flex' justifyContent='space-between'>
          <Typography variant='h6'>
            <Box
              fontWeight='bold'
              component='div'
              style={{ textTransform: 'uppercase' }}>
              Nhật ký hoạt động
            </Box>
          </Typography>
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
                search: search?.trim() || '',
                filters: [],
                // [`sort[][${sortKey}]`]: 'asc',
              };

              if (orderBy) {
                bodyData[`sort[][${orderBy.sortKey || orderBy.field}]`] =
                  orderDirection;
              }

              if (filters?.length) {
                filters.forEach((item) => {
                  if (item.value !== 'all') {
                    if (item.column.filterKey === 'role') {
                      item.value = roleList.find(
                        (roleItem) =>
                          roleItem.name === item.column.tableData.filterValue
                      )?._id;
                    }

                    bodyData.filters.push({
                      filter_type: item.column.filterKey || item.column.field,
                      value: item.value,
                    });
                  }
                });
              }

              // bodyData.filters = JSON.stringify(bodyData.filters);

              axiosService
                .get('/tracking-employee', bodyData)
                .then((res) => {
                  resolve({
                    data: res.data.tracking_employee,
                    page,
                    totalCount: res.data.paging.total,
                  });

                  // setEmployeeData(res.data.site_users);
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
          isCustomFilter
        />
      </Box>
    </Box>
  );
};

export default ManageTracking;
