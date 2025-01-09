import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { CheckCircleOutline } from '@material-ui/icons';
import axiosService from 'config/axiosService';
import { formatCurrencyVnd } from 'constants/common';
import { ENV_ASSETS_ENDPOINT } from 'env/local';
import useUserData from 'hooks/useUserData';
import MaterialTable, { MTableToolbar } from 'material-table';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from 'utils';

const useStyle = makeStyles((theme) => ({
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
  typoPromo: {
    color: '#1C523C',
    fontWeight: 'bold',
  },
  typoConnected: {
    color: '#2DCF58',
    fontWeight: 'bold',
  },
  typoVip: {
    color: '#f20d0d',
    fontWeight: 'bold',
  },
  tdBorderRight: {
    borderRight: '1px solid #e0e0e0',
  },
  tableCustom: {
    overflowX: 'initial',
  },
}));

export default forwardRef(function ChooseOneProduct(props, ref) {
  const classes = useStyle();
  const { userData } = useUserData();
  const [productData, setProductData] = useState([]);
  function getProductData(page = 1, type = null) {
    axiosService
      .get('/product-in-site', {
        site: userData?.site?.id,
        page: page,
        limit: 10000,
        key: '',
        is_promotion: true,
        fullPrice: true,
      })
      .then((res) => {
        const data = res.data;
        setProductData(data.products);
      });
  }
  function handleSelectRow(row) {
    props.setProductChoose([row]);
    props.handleClose();
  }

  function reMoutedData() {
    props.setProductChoose([]);
    productData.forEach((item) => {
      if (item.tableData) {
        item.tableData.checked = false;
      }
    });
  }
  useImperativeHandle(ref, () => ({
    reMoutedData,
  }));

  useEffect(() => {
    getProductData();
  }, []);
  return (
    <Box p={4}>
      <Paper elevation={2}>
        <Typography variant='h6'>
          <Box p={2} fontWeight='bold' component='div'>
            Chọn một sản phẩm khuyến mãi
          </Box>
        </Typography>
        <MaterialTable
          data={productData}
          columns={[
            {
              title: 'Mã sản phẩm',
              field: 'id',
              render: (data) => {
                return data._id.slice(-6);
              },
            },
            {
              title: 'Ảnh sản phẩm',
              searchable: false,
              render: (data) => {
                return (
                  <Box className={classes.logo}>
                    <img
                      src={`${ENV_ASSETS_ENDPOINT}${data.imgs[0]?.link}`}
                      alt={`${data.imgs[0]?.alt}`}
                    />
                  </Box>
                );
              },
            },
            { title: 'Tên sản phẩm', field: 'name' },
            {
              title: 'Giá public',
              searchable: false,
              hidden: !props.isRetail,
              render: (data) => {
                const { public_price } = data.product_in_site[0];
                return (
                  <Typography variant='body2'>
                    {`${formatCurrencyVnd(public_price.price)}`}
                    {public_price.discount > 0 ? (
                      <Typography
                        component='span'
                        className={classes.typoPromo}
                        variant='body2'>{` (${public_price.discount}%)`}</Typography>
                    ) : (
                      ''
                    )}
                  </Typography>
                );
              },
            },
            {
              title: 'Giá liên kết',
              searchable: false,
              hidden: !props.isRetail,
              render: (data) => {
                const { connected_price } = data.product_in_site[0];

                return (
                  <Typography variant='body2'>
                    {`${formatCurrencyVnd(connected_price.price)}`}
                    {connected_price.discount > 0 ? (
                      <Typography
                        component='span'
                        className={classes.typoPromo}
                        variant='body2'>{` (${connected_price.discount}%)`}</Typography>
                    ) : (
                      ''
                    )}
                  </Typography>
                );
              },
            },
            {
              title: 'Giá vip',
              searchable: false,
              hidden: !props.isRetail,
              render: (data) => {
                const {
                  connected_price,
                  public_price,
                  vip_price,
                } = data.product_in_site[0];
                return (
                  <Typography variant='body2'>
                    {`${formatCurrencyVnd(vip_price.price)}`}
                    {vip_price.discount > 0 ? (
                      <Typography
                        component='span'
                        className={classes.typoPromo}
                        variant='body2'>{` (${vip_price.discount}%)`}</Typography>
                    ) : (
                      ''
                    )}
                  </Typography>
                );
              },
            },
            {
              title: 'Giá',
              searchable: false,
              hidden: props.isRetail,
              headerStyle: {
                textAlign: 'center',
              },
              render: (data) => {
                const {
                  connected_price,
                  price_list,
                  price_list_vip,
                  wholesail_discount,
                  wholesail_discount_vip,
                } = data.product_in_site[0];

                return (
                  <TableContainer
                    component={Paper}
                    className={classes.tableCustom}>
                    <Table
                      className={classes.table}
                      size='small'
                      aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Đối tượng</TableCell>
                          <TableCell align='center'>Số lượng</TableCell>
                          <TableCell>Giá(đ)</TableCell>
                          <TableCell align='right'>Giảm giá</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {price_list.map((row, index) => (
                          <TableRow key={row._id}>
                            {index === 0 && (
                              <TableCell
                                align='left'
                                rowSpan={price_list.length}
                                className={classes.tdBorderRight}>
                                <Typography
                                  component='span'
                                  className={classes.typoConnected}
                                  variant='body2'>
                                  Liên kết
                                </Typography>
                              </TableCell>
                            )}
                            <TableCell align='center'>{row.quantity}</TableCell>
                            <TableCell className={classes.tdBorderRight}>
                              {`${formatCurrencyVnd(row.price, '')}`}
                            </TableCell>
                            {index === 0 && (
                              <TableCell
                                align='right'
                                rowSpan={price_list.length}>
                                <Typography
                                  component='span'
                                  className={classes.typoPromo}
                                  variant='body2'>{` (${wholesail_discount}%)`}</Typography>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                        {price_list_vip.map((row, index) => (
                          <TableRow key={row._id}>
                            {index === 0 && (
                              <TableCell
                                className={classes.tdBorderRight}
                                align='left'
                                rowSpan={price_list_vip.length}>
                                <Typography
                                  component='span'
                                  className={classes.typoVip}
                                  variant='body2'>
                                  Vip
                                </Typography>
                              </TableCell>
                            )}
                            <TableCell align='center'>{row.quantity}</TableCell>
                            <TableCell className={classes.tdBorderRight}>
                              {`${formatCurrencyVnd(row.price, '')}`}
                            </TableCell>
                            {index === 0 && (
                              <TableCell
                                align='right'
                                rowSpan={price_list_vip.length}>
                                <Typography
                                  component='span'
                                  className={classes.typoPromo}
                                  variant='body2'>{` (${wholesail_discount_vip}%)`}</Typography>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              },
            },
            {
              title: 'Loại',
              field: 'product_id.name',
              headerStyle: {
                textAlign: 'right',
              },
              cellStyle: {
                textAlign: 'right',
              },
              render: (data) => {
                const isMy =
                  data.product_in_site[0]?.imported_site ===
                  data.product_in_site[0]?.site;
                return (
                  <Typography variant='body2'>
                    {isMy ? 'Tự sản xuất' : 'Copy'}
                  </Typography>
                );
              },
            },
            {
              title: 'Hành Động',
              field: 'actions',
              render: (data) => {
                return (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      handleSelectRow(data);
                    }}
                    endIcon={<CheckCircleOutline color='secondary' />}>
                    Chọn
                  </Button>
                );
              },
            },
          ]}
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
            selection: false,
          }}
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
              emptyDataSourceMessage: 'Chưa có sản phẩm có khuyến mãi',
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
