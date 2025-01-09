import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Grid,
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
import {
  checkToday,
  formatDate,
  formatRelativeTime,
  lookupRole,
  lookupTrackingAction,
  trackingActionColor,
} from 'constants/common';

import { formatCurrencyVnd } from 'constants/common';
import HRCustom from 'components/HRCustom';
import { BaseIcon } from 'assets/icon/BaseIcon';
import Loading from 'components/Layout/Loading';

import GroupSwitchLayout from '../ManageTracking/GroupSwitchLayout';

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

const ManageTrackingList = () => {
  const classes = useStyles();

  const userData = useSelector((state) => state.user.userData);

  const roleList = useSelector((state) => state.global.initData.roles);
  const orderStatusObj = useSelector((state) =>
    convertArrayToObject(state.global.initData.orderStatus, '_id')
  );

  const [trackingData, setTrackingData] = useState([]);

  // const [savePaging, setSavePaging] = useState({});

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isEndLoadMore, setIsEndLoadMore] = useState(null);

  const timeOut = useRef(null);
  const savePaging = useRef({});
  const saveTrackingData = useRef([]);

  const isEndLoadMoreRef = useRef(false);
  const isLoadingMoreRef = useRef(false);

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
      .replace('[orderId]', orderId?.slice(-4) || 'chưa rõ')
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
      .replace('[id]', id?.slice(-4) || 'chưa rõ')
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
      .replace('[orderId]', orderId?.slice(-4) || 'chưa rõ')
      .replace('[totalPrice]', formatCurrencyVnd(totalPrice));
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

  const fetchData = async (isLoadMore) => {
    let bodyData = {
      offset: isLoadMore
        ? savePaging.current.offset + savePaging.current.limit
        : 0,
      limit: 20,
      'sort[][created_at]': 'desc',
    };

    try {
      const data = await axiosService
        .get('/tracking-employee', bodyData)
        .then((res) => res.data);

      if (data.paging.offset + data.paging.limit >= data.paging.total) {
        setIsEndLoadMore(true);
        isEndLoadMoreRef.current = true;
      }

      if (data.tracking_employee?.length) {
        let newTrackingData = [...saveTrackingData.current];
        data.tracking_employee.forEach((item) => {
          if (item.created_at) {
            const createdAtDate = new Date(item.created_at);
            item.createdAtKey = createdAtDate?.toLocaleDateString();

            const foundIndex = newTrackingData.findIndex(
              (itemTracking) => item.createdAtKey === itemTracking.createdAtKey
            );

            let formatItem = {
              id: item._id,
              fullName: '',
              detail: generateDetail(item),
              role: '',
              type: item.type,
              created_at: item.created_at,
            };

            const { site_user } = item;

            const { first_name, name } = site_user.user || {};

            formatItem.fullName = `${first_name ? first_name + ' ' : ''}${
              name || ''
            }`;

            formatItem.role = site_user.role.name;

            if (foundIndex < 0) {
              newTrackingData.push({
                createdAtKey: item.createdAtKey,
                dateString: `${createdAtDate.getDate()} tháng ${
                  createdAtDate.getMonth() + 1
                }, ${createdAtDate.getFullYear()}`,
                data: [
                  {
                    ...formatItem,
                  },
                ],
              });
            } else {
              const findIndexItem = newTrackingData[foundIndex].data.findIndex(
                (oldItem) => oldItem.id === item._id
              );
              if (findIndexItem < 0) {
                newTrackingData[foundIndex].data.push({
                  ...formatItem,
                });
              }
            }
          }
        });

        saveTrackingData.current = newTrackingData;
        setTrackingData(newTrackingData);
      }

      savePaging.current = data.paging;
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  };

  function handleScroll() {
    let bottomOfWindow =
      window.scrollY + window.innerHeight + 100 >=
      document.documentElement.scrollHeight;
    if (
      bottomOfWindow &&
      !isLoadingMoreRef.current &&
      !isEndLoadMoreRef.current
    ) {
      setIsLoadingMore(true);
      isLoadingMoreRef.current = true;
      clearTimeout(timeOut.current);
      timeOut.current = setTimeout(() => {
        fetchData(true);
      }, 200);
    }
  }

  useEffect(() => {
    fetchData();
    setIsEndLoadMore(false);
    // window.addEventListener('scroll', handleScroll, false);
    // return () => {
    //   window.removeEventListener('scroll', handleScroll, false);
    // };
  }, []);

  useEffect(() => {
    if (isEndLoadMore === false) {
      window.addEventListener('scroll', handleScroll, false);
    }

    if (isEndLoadMore === true) {
      window.removeEventListener('scroll', handleScroll, false);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, false);
    };
  }, [isEndLoadMore]);

  return (
    <Box mt={4} mb={2}>
      {/* <Box>
        <Button startIcon= >

        </Button>
      </Box> */}

      <GroupSwitchLayout />
      <Typography variant='h6'>
        <Box
          fontWeight='bold'
          component='div'
          style={{ textTransform: 'uppercase' }}
          mb={1}>
          Nhật ký hoạt động
        </Box>
      </Typography>
      {trackingData.map((trackingItem, indexTracking) => (
        <Box
          component={Paper}
          mb={2}
          elevation={0}
          p={3}
          key={`${indexTracking}__tracking`}>
          <Box mb={1}>
            <Typography>
              <Box fontWeight='bold' component='span'>
                {trackingItem.dateString}
              </Box>
            </Typography>
          </Box>

          {trackingItem.data.map((item, index) => {
            const MyIcon =
              BaseIcon[trackingActionColor[item.type]?.iconNew || 'Default'];
            return (
              <Grid container key={`${index}__trackingItem`}>
                <Grid item>
                  <Box
                    width='50px'
                    height='50px'
                    bgcolor={trackingActionColor[item.type]?.color}
                    color='#fff'
                    borderRadius='5px'
                    display='flex'
                    justifyContent='center'
                    alignItems='center'>
                    <MyIcon width='25px' height='25px' />
                  </Box>
                </Grid>
                <Grid item xs={10}>
                  <Box pl={2}>
                    <Box fontWeight='500' fontSize='15px'>{`${
                      lookupRole[item.role]
                    } - ${item.fullName}`}</Box>
                    <Box>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.detail }}></div>
                    </Box>
                    {/* <Box>{formatRelativeTime(item.created_at)}</Box> */}
                    <Box>
                      {checkToday(item.created_at)
                        ? formatRelativeTime(item.created_at)
                        : formatDate(item.created_at, 'HH:mm:ss')}
                    </Box>
                  </Box>
                </Grid>
                {index !== trackingItem.data.length - 1 && (
                  <Grid item xs={12}>
                    <Box mb={2}>
                      <HRCustom />
                    </Box>
                  </Grid>
                )}
              </Grid>
            );
          })}
        </Box>
      ))}
      {isLoadingMore && (
        <Box minHeight='100px' display='flex'>
          <Loading />
        </Box>
      )}
    </Box>
  );
};

export default ManageTrackingList;
