import {
  Box,
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import cn from 'classnames';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { formatAddress } from 'utils';
import axiosService from '../../config/axiosService';
import { formatCurrencyVnd, formatDate } from '../../constants/common';
import PrintIcon from '@material-ui/icons/Print';

const useStyles = makeStyles((theme) => ({
  groupHeader: {
    borderBottom: '0.5px solid #CCD6DD',
    display: 'flex',
  },
  info: {
    // flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    '& .MuiTypography-root.MuiTypography-h6': {
      width: '100%',
    },
  },
  state: {
    minWidth: '200px',
    marginLeft: 'auto',
  },
  selling: {
    color: theme.palette.success.main,
  },
  notSell: {
    color: theme.palette.error.main,
  },

  customBtn: {
    '&.MuiButton-containedPrimary': {
      backgroundColor: theme.palette.success.main,
    },
    '&.MuiButton-containedSecondary': {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  },
  btnTab: {
    color: '#788288',
    fontSize: '16px',
    paddingBottom: theme.spacing(1.5, 0),
    minWidth: '170px',
    '&.active': {
      color: '#0B86D0',
      fontWeight: 'bold',
      borderBottom: '1px solid #0B86D0',
      borderRadius: '1px',
    },
  },
  groupTab: {
    position: 'relative',
  },
  tabCtn: {
    marginBottom: theme.spacing(3),
  },
  btnCancle: {
    '&.MuiButton-containedPrimary': {
      backgroundColor: '#E35847',
    },
  },
  table: {
    '& .MuiTableCell-head': {
      fontWeight: 'bold',
    },
  },
  // pagebreak: {
  //   '@media print': {
  //     clear: 'both',
  //     'page-break-after': 'always',
  //   },
  // },
}));

const statusLabelAction = {
  pending: {
    label: 'Xác nhận đơn',
  },
  confirmed: {
    label: 'Chuyển sang kho',
  },
  packed: {
    label: 'Giao hàng',
  },
};

const listShowAction = ['pending', 'confirmed', 'packed'];

export default function EditOrder(props) {
  const { lookupOrderStatus, orderStatus } = props.initData;

  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [orderTracking, setOrderTracking] = useState([]);

  let {
    status,
    _id,
    deal_start,
    order,
    site,
    updated_by,
    last_updater_user_type,
    confirmed_site_user,
    official_account,
  } = props.data || {};
  const is_product_deleted = order?.some((item) => item.is_product_deleted);
  const getProductInSiteData = useCallback(async () => {
    axiosService
      .get('/order-tracking', {
        order_in_site_id: _id,
      })
      .then((res) => {
        if (res.status === 200) {
          setOrderTracking(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [_id]);

  useEffect(() => {
    if (!_id) return;
    getProductInSiteData();
  }, [_id]);

  if (!props.data) return <CircularProgress color='inherit' />;
  function renderLabelData({ label, data, key }, index) {
    if (key === 'address') {
      data = formatAddress(data, props.provinceList);
    }

    return (
      <Grid item xs={6} key={index}>
        <Box display='flex'>
          <Box width='50%'>
            <Typography variant='body1'>
              <Box component='span' fontWeight='bold'>
                {label}:
              </Box>
            </Typography>
          </Box>
          <Box width='50%'>
            <Typography variant='body1'>
              <Box component='span'>{data}</Box>
            </Typography>
          </Box>
        </Box>
      </Grid>
    );
  }

  function getAllPrice() {
    if (order.length <= 0) return 0;
    return formatCurrencyVnd(
      order.reduce((price, item) => price + item.quantity * item.price, 0)
    );
  }

  function handleUpdateOrder() {
    // orderStatus
    if (!status) return;
    let nextStatus = '';
    switch (status) {
      case 'pending':
        nextStatus = orderStatus.packed._id;
        break;
      case 'confirmed':
        nextStatus = orderStatus.packed._id;
        break;
      case 'packed':
        nextStatus = orderStatus.shipping._id;
        break;
      default:
        return;
    }
    updateStatus(nextStatus);
  }

  function updateStatus(idStatus) {
    axiosService
      .patch('/order', {
        id_order_in_site: _id,
        status: idStatus,
      })
      .then((res) => {
        const { updated_order_in_site, statusTracking } = res.data;
        setOrderTracking((currentValue) => [
          ...currentValue,
          {
            ...statusTracking,
          },
        ]);
        props.setItemEdit(updated_order_in_site);
        props.handleRefeshData();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  function handleCancleOrder() {
    updateStatus(orderStatus.canceled._id);
  }

  function renderOrderInfo() {
    return (
      order.length > 0 && (
        <TableContainer
        // component={Paper}
        >
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Mã sản phẩm</TableCell>
                <TableCell align='center'>Tên sản phẩm</TableCell>
                <TableCell align='center'>Giá tiền</TableCell>
                <TableCell align='center'>Số lượng</TableCell>
                <TableCell align='center'>Giảm giá</TableCell>
                <TableCell align='center'>Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.map((row, index) => {
                const { final_discount } = row.product_in_site;
                let priceNotDiscount = row.price;

                if (final_discount) {
                  // a / (1 - b);
                  priceNotDiscount = parseInt(
                    row.price / (1 - final_discount / 100)
                  );
                }

                const totalPrice = row.price * row.quantity;

                return (
                  <TableRow key={index}>
                    <TableCell align='center'>{row._id.slice(-6)}</TableCell>
                    <TableCell align='center'>
                      {row.product_in_site?.product?.name || ''}
                    </TableCell>

                    <TableCell align='center'>
                      {formatCurrencyVnd(priceNotDiscount)}
                    </TableCell>
                    <TableCell align='center'>{row.quantity}</TableCell>
                    <TableCell align='center'>
                      {formatCurrencyVnd(
                        priceNotDiscount * row.quantity - totalPrice
                      )}
                    </TableCell>
                    <TableCell align='center'>
                      {formatCurrencyVnd(totalPrice)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )
    );
  }

  function handlePrint() {
    setActiveTab(0);

    setTimeout(() => {
      window.print();
    }, 300);
  }

  return (
    <Box pt={3.5} px={6}>
      <div className={classes.groupHeader}>
        <div className={classes.info}>
          <Box width='100%' mb={2} display='flex'>
            <Box mr={2}>
              <Typography variant='h6'>
                Đơn hàng: {_id?.slice(-6) || ''}
              </Typography>
            </Box>
            <Box displayPrint='none'>
              <Button
                color='primary'
                variant='contained'
                onClick={handlePrint}
                startIcon={<PrintIcon />}>
                In đơn
              </Button>
            </Box>
          </Box>
          <Box displayPrint='none'>
            <Button
              variant='text'
              disableElevation
              className={cn({
                [classes.btnTab]: true,
                active: activeTab === 0,
              })}
              onClick={() => setActiveTab(0)}>
              Thông tin đơn hàng
            </Button>
            <Button
              disableElevation
              variant='text'
              onClick={() => setActiveTab(1)}
              className={cn({
                [classes.btnTab]: true,
                active: activeTab === 1,
              })}>
              Danh sách sản phẩm
            </Button>
          </Box>
        </div>
        <div className={classes.state}>
          <Box pb={1.5}>
            <Typography variant='h6'>
              Trạng thái:
              <Box pl={2} component='span' color={orderStatus[status].color}>
                {lookupOrderStatus[status]}
              </Box>
            </Typography>
          </Box>
        </div>
      </div>
      <Box my={5} className={classes.groupTab}>
        <Grid
          style={{
            display: activeTab === 0 ? 'flex' : 'none',
          }}
          container
          justifyContent='space-between'
          className={classes.tabCtn}
          spacing={2}>
          {[
            {
              label: 'Ngày lên đơn',
              data: moment(deal_start).format('DD/MM/YYYY'),
            },
            {
              label: 'Công ty',
              data: site?.name || '',
            },
            {
              label: 'Cập nhật lần cuối bởi',
              data: ['buyer', 'buyer_owner', 'buyer_employee'].includes(
                last_updater_user_type
              )
                ? 'Khách hàng'
                : `Nhân viên ${
                    (updated_by?.first_name
                      ? updated_by?.first_name + ' '
                      : '') + updated_by?.name || 'chưa rõ'
                  }`,
            },
            {
              label: 'Nhân viên chốt đơn',
              data:
                (confirmed_site_user?.user?.first_name
                  ? confirmed_site_user?.user?.first_name + ' '
                  : '') + (confirmed_site_user?.user?.name || ''),
            },
            {
              label: 'Tổng tiền',
              data: getAllPrice(),
            },
            {
              label: 'Khách hàng',
              data: official_account?.full_name || '',
            },
            {
              label: 'Phí ship',
              data: '0đ',
            },
            {
              label: 'Số điện thoại',
              data: official_account?.phone_number || '',
            },
            {
              label: 'Địa chỉ giao hàng',
              data: official_account.address,
              key: 'address',
            },
          ].map((item, index) => renderLabelData(item, index))}

          <Box display='none' displayPrint='block' p={1.5}>
            <Grid item xs={12}>
              <Box displayPrint='block' display='none'>
                <Typography variant='body1'>
                  <Box component='span' fontWeight='bold'>
                    Danh sách sản phẩm
                  </Box>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display='none' displayPrint='flex'>
                <Box className={classes.tabCtn} width={1}>
                  {renderOrderInfo()}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box displayPrint='block' display='none'>
                <Typography variant='body1'>
                  <Box component='span' fontWeight='bold'>
                    Trạng thái đơn hàng
                  </Box>
                </Typography>
              </Box>
            </Grid>
          </Box>

          <Grid item xs={12}>
            {orderTracking.length > 0 && (
              <TableContainer
              // component={Paper}
              >
                <Table className={classes.table} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell width='50%' align='center'>
                        Trạng thái
                      </TableCell>
                      <TableCell width='50%' align='left'>
                        Thời gian
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderTracking.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align='center'>
                          <Box
                            py={2}
                            component='span'
                            color={orderStatus[row.status.name].color}
                            fontWeight='bold'
                            fontSize='1rem'>
                            {row.status.description}
                          </Box>
                        </TableCell>
                        <TableCell
                          align='left'
                          style={{
                            textTransform: 'capitalize',
                          }}>
                          {formatDate(
                            row.updated_at,
                            'dddd, [ngày] DD [tháng] M [năm] YYYY - HH:mm'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
        <Box
          style={{
            display: activeTab === 0 ? 'none' : 'flex',
          }}
          className={classes.tabCtn}
          width={1}>
          {renderOrderInfo()}
        </Box>

        {is_product_deleted && status === 'pending' && (
          <Box textAlign='center'>
            <Typography variant='body2' color='error'>
              Sản phẩm trong đơn hàng đã bị xoá.
            </Typography>
          </Box>
        )}

        <Box display='flex' justifyContent='flex-end' displayPrint='none'>
          <Box minWidth='70%'>
            <Grid container spacing={2} justifyContent='flex-end'>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    props.handleClose();
                  }}>
                  <Box py={1}>Đóng</Box>
                </Button>
              </Grid>
              {status && listShowAction.includes(status) && (
                <>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant='contained'
                      color='primary'
                      className={classes.btnCancle}
                      disabled={false}
                      onClick={handleCancleOrder}>
                      <Box py={1}>Hủy đơn</Box>
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant='contained'
                      color='primary'
                      disabled={is_product_deleted && status === 'pending'}
                      onClick={handleUpdateOrder}>
                      <Box py={1} whiteSpace='nowrap'>
                        {statusLabelAction[status]?.label || 'Xác nhận đơn'}
                      </Box>
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
