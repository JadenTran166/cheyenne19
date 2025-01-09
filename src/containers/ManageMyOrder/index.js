import { Box, Button, Typography } from '@material-ui/core';
import { orderStatusColor } from 'constants/common';
import React, { useEffect, useRef, useState } from 'react';
import CommonLayout from 'components/CommonLayout';

import axiosService from 'config/axiosService';

import LeftManageOrder from './LeftManageOrder';
import RightManageOrder from './RightManageOrder';
import Loading from 'components/Layout/Loading';

export default function ManageProduct() {
  const [initData, setInitData] = useState({
    orderStatus: {},
    lookupOrderStatus: {},
    order_in_site: [],
  });
  const [fromDate, setFromDate] = useState(
    new Date('2020-01-01'.replace(/-/g, '/')).valueOf()
  );
  const [toDate, setToDate] = useState(new Date().valueOf());
  const timerRef = useRef(null);
  const [checkedState, setCheckedState] = React.useState({});

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const listStatus = Object.values(initData.orderStatus);
    if (listStatus.length > 0) {
      let result = listStatus.reduce(
        (rs, item) => ({ ...rs, [item.name]: false }),
        {}
      );

      setCheckedState(result);
    }
  }, [initData.orderStatus]);

  const handleChange = (event) => {
    const newData = {
      ...checkedState,
      [event.target.name]: event.target.checked,
    };
    setCheckedState({ ...newData });

    const listFilter = Object.keys(newData)
      .filter((key) => newData[key])
      .map((item) => ({
        filter_type: 'status',
        value: item,
      }));
    refreshDataOrder(listFilter);
  };

  async function getDataOrder() {
    try {
      const data = await axiosService
        .get('/order/user', {
          limit: 100,
          startDate: fromDate,
          endDate: toDate,
          // page: 1,
        })
        .then((res) => res.data);
      const orderStatusData = await axiosService
        .get('/order-status')
        .then((res) => res.data);
      let orderStatus = {};
      let lookupOrderStatus = {};
      orderStatusData.forEach((element) => {
        orderStatus[element.name] = {
          ...element,
          color: orderStatusColor[element.name]?.color || '#ffffff',
        };
        lookupOrderStatus[element.name] = element.description;
      });

      setInitData({
        orderStatus,
        lookupOrderStatus,
        order_in_site: data.order_in_site,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  }

  const handleSelectDate = (fromDate, toDate) => {
    if (fromDate) {
      setFromDate(fromDate);
    }
    if (toDate) {
      setToDate(toDate);
    }
  };

  function refreshDataOrder(filters = []) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await axiosService
          .get('/order/user', {
            limit: 100,
            startDate: fromDate,
            endDate: toDate,
            // page: 1,
            filters,
          })
          .then((res) => res.data);

        setInitData({
          ...initData,
          order_in_site: data.order_in_site,
        });
      } catch (error) {
        console.error(error);
      }
    }, 300);
  }

  useEffect(() => {
    getDataOrder();
  }, [toDate, fromDate]);

  return (
    <Box mt={4}>
      <CommonLayout
        // leftComponent={
        //   <LeftManageOrder
        //     orderStatus={initData.orderStatus}
        //     checkedState={checkedState}
        //     handleChange={handleChange}
        //   />
        // }
        rightComponent={
          isLoadingData ? (
            <Box minHeight='300px' display='flex'>
              <Loading />
            </Box>
          ) : (
            <RightManageOrder
              data={initData}
              getData={refreshDataOrder}
              handleSelectDate={handleSelectDate}
            />
          )
        }></CommonLayout>
    </Box>
  );
}
