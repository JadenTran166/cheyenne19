import {
  Box,
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { GetApp, Publish } from '@material-ui/icons';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import { ConfirmDialog } from 'components/AlertModal/AlertModal';
import CommonImg from 'components/CommonImg';
import { formatCurrencyVnd, USER_TYPE } from 'constants/common';
import { ENV_API_ENDPOINT, ENV_ASSETS_ENDPOINT } from 'env/local';
import useUserData from 'hooks/useUserData';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import CommonDrawer from '../../components/CommonDrawer';
import DialogWithClose from '../../components/DialogWithClose';
import ExportExcel from '../../components/ExportExcel';
import axiosService from '../../config/axiosService';
import { Alert, convertArrayToObject } from '../../utils';
import EditProduct from './EditProduct';
import ListTableProduct from './ListTableProduct';

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
  stateProductSelled: {
    color: theme.palette.success.main,
  },
  stateProductNotSell: {
    color: theme.palette.error.main,
  },
  customBodyTable: {
    '& .MuiTable-root': {
      minWidth: '1200px',
    },
  },
  formControl: {
    width: '100%',
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
  groupAction: {
    '& .MuiButton-label': {
      textTransform: 'uppercase',
      alignItems: 'center',
    },
  },
}));
export default function RightManageProduct(props) {
  const classes = useStyles();
  const tableRef = useRef(null);

  const { userData } = useUserData();
  const [productData, setProductData] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState('list'); // list: list san pham / price: cap nhat gia nhanh
  const [isLoadingDataUpdate, setIsLoadingDataUpdate] = useState(true);
  const [itemEdit, setItemEdit] = useState(null);
  const [itemShowPrice, setItemShowPrice] = useState(null);

  const [fileData, setFileData] = useState();
  const [haveNewImportedProduct, setHaveNewImportedProduct] = useState(false);
  const inputFile = useRef(null);

  const [initData, setInitData] = useState({
    country: [],
    category: [],
    sub_category: [],
    unitData: [],
    ingredient: [],
  });
  const [updateValue, setUpdateValue] = useState({
    product_in_site_edit: [],
  });
  const isRetail = userData.seller_type === USER_TYPE.RETAIL;

  const [columnListProduct, setColumnListProduct] = useState([]);

  const [optionsListProduct, setOptionsListProduct] = useState({
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

  async function getData() {
    try {
      const params = {
        key: '',
        page: 1,
        limit: 100,
        site: userData?.site?._id,
        owner: true,
        fullPrice: true,
        sub_category: selectedSubCategoryId,
      };
      const data = await axiosService
        .get('/product-in-site', params)
        .then((res) => res.data);
      setProductData(
        data.products.map((item) => {
          return {
            ...item,
            action: '',
            isMy:
              item.product_in_site[0]?.imported_site ===
              item.product_in_site[0]?.site,
          };
        })
      );
    } catch (error) {
      console.error(error);
      Alert.fire({
        icon: 'warning',
        title: "Can't load product data. Try again !",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getInitData = async () => {
    try {
      const requestCategory = axiosService.get('/category');
      const requestCountry = axiosService.get('/country');
      const requestProductInSiteStatus = axiosService.get(
        '/product-in-site/status'
      );

      const requestUnit = axiosService.get('/unit');
      const requestMysite = axiosService.get(`/my-site`);
      const requestNutritionalIngredients = axiosService.get(
        `/nutritional_ingredients`
      );

      const [
        categoryData,
        countryData,
        // ingreData,
        unitData,
        mysiteData,
        productInSiteStatusData,
        nutritionalIngredientsData,
      ] = await Promise.all([
        requestCategory.then((res) => res.data),
        requestCountry.then((res) => res.data),
        // requestIngredients.then((res) => res.data),
        requestUnit.then((res) => res.data),
        requestMysite.then((res) => res.data),
        requestProductInSiteStatus.then((res) => res.data),
        requestNutritionalIngredients.then((res) => res.data),
      ]);
      unitData.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
      let categoryForFilter = [];

      let categoryForFilterGroup = [];

      let lookupCategory = {};
      let lookupSubCategory = {};

      categoryData.forEach((cate) => {
        const children = [...cate.sub_category];
        categoryForFilter = [
          ...categoryForFilter,
          {
            name: cate.name,
            _id: cate._id,
            isParent: true,
          },
        ];

        categoryForFilterGroup = [
          ...categoryForFilterGroup,
          {
            name: cate.name,
            _id: cate._id,
            isParent: true,
          },
          ...children,
        ];

        lookupCategory[cate._id] = cate.name;

        children.forEach((subCate) => {
          lookupSubCategory[subCate._id] = subCate.name;
        });
      });

      let lookupProductInSiteStatus = {};
      productInSiteStatusData.data.listProductInSiteStatus.forEach((item) => {
        lookupProductInSiteStatus[item._id] = item.name;
      });
      setInitData({
        country: countryData,
        category: categoryForFilter,
        unitData: unitData,
        sub_category: convertArrayToObject(categoryData, 'id'),
        // ingredient: ingreData,
        mysiteData: mysiteData,
        categoryForFilterGroup: categoryForFilterGroup,
        categoryById: convertArrayToObject(categoryForFilter, '_id'),
        lookupCategory,
        lookupSubCategory,
        lookupProductInSiteStatus,
        nutritionalIngredients: nutritionalIngredientsData,
      });
    } catch (error) {
      console.error(error);
      Alert.fire({
        icon: 'warning',
        title: "Can't load data. Try again !",
      });
    } finally {
      setIsLoadingDataUpdate(false);
    }
  };

  const deleteProduct = (data) => {
    axiosService
      .delete('/product-in-site/' + data.product_in_site[0]._id)
      .then((res) => {
        Alert.fire({
          icon: 'success',
          title: 'Xóa thành công',
        });

        setProductData((oldData) => {
          return oldData.filter((item) => item._id !== data._id);
        });
      })
      .catch((error) => {
        console.error(error);
        Alert.fire({
          icon: 'error',
          title: 'Xóa không thành công. Vui lòng thử lại .',
        });
      });
  };

  function handleDeleteProduct(data) {
    if (!data._id) return;
    const messageTrigger = {
      title: `Bạn chắc chắn muốn xóa sản phẩm ${data.name} ?`,
      text: '',
      icon: 'info',
      preConfirm: () => {deleteProduct(data)},
    };
    ConfirmDialog(messageTrigger);
  }

  const handleBack = () => {
    if (updateValue.product_in_site_edit.length > 0) {
      Swal.fire({
        title: 'Thay đổi của bạn chưa được lưu, bạn có chắc muốn quay lại?',
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Ở lại',
        confirmButtonText: `Quay về`,
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setTab('list');
          setUpdateValue({
            product_in_site_edit: [],
          });
        }
      });
    } else {
      setTab('list');
    }
  };
  const groupingEditingValue = (newValue) => {
    // To group all the product in site key to array
    const isEdittingArray = [];
    const keys = Object.keys(newValue);
    keys.forEach((key) => {
      const splitedKey = key.split('.'); // get the pis;
      if (
        !isEdittingArray.includes(splitedKey[0]) &&
        splitedKey[0] !== 'product_in_site_edit'
      ) {
        isEdittingArray.push(splitedKey[0]);
      }
    });
    setUpdateValue({
      ...newValue,
      product_in_site_edit: isEdittingArray,
    });
  };
  const handleChangePriceOrDiscount = (e, pis_id, defaultValue) => {
    const newUpdatedValue = { ...updateValue };
    const key = `${pis_id}.${e.target.name}`;
    const isDefault = Number(e.target.value) === defaultValue;

    // check value is the same as default
    if (isDefault) {
      if (newUpdatedValue[key]) {
        // remove key if already edit
        delete newUpdatedValue[key];
        groupingEditingValue(newUpdatedValue);
      }
    } else {
      newUpdatedValue[key] = Number(e.target.value);
      groupingEditingValue(newUpdatedValue);
    }
  };
  useEffect(() => {
    getInitData();
  }, []);

  //Rerender filter sub category
  useEffect(() => {
    if (userData?.site?._id) {
      getData();
    }
  }, [
    userData?.site?._id,
    props.subCategoryFilter,
    selectedSubCategoryId,
    haveNewImportedProduct,
  ]);

  useEffect(() => {
    setColumnListProduct([
      {
        title: 'Mã sản phẩm',
        field: 'id',
        minWidth: '150',
        render: (data) => {
          return data._id.slice(-6);
        },
      },
      {
        title: 'Ảnh',
        render: (data) => {
          let { alt, link } = data.imgs?.[0] || {};
          if (link) {
            link = ENV_ASSETS_ENDPOINT + link;
          }
          return (
            <Box>
              <CommonImg src={link} alt={alt} isReview />
            </Box>
          );
        },
      },
      { title: 'Tên sản phẩm', field: 'name', minWidth: '200px' },

      {
        title: 'Loại',
        field: 'isMy',
        minWidth: '150px',
        lookup: { true: 'Tự sản xuất', false: 'Copy' },
      },
      {
        title: 'Danh mục',
        field: 'sub_category.category_id',
        lookup: initData?.lookupCategory || {},
        minWidth: '200px',
      },
      {
        title: 'Danh mục con',
        field: 'sub_category._id',
        lookup: initData?.lookupSubCategory || {},
        minWidth: '200px',
      },
      {
        title: 'Trạng thái',
        field: 'product_in_site[0].status._id',
        lookup: initData?.lookupProductInSiteStatus || {},
        minWidth: '150px',
        render: (data) => {
          const isSelled =
            data.product_in_site[0]?.status?._id === '5f9c0f708a9f141cdec6cdbb';
          return (
            <Box
              className={
                isSelled
                  ? classes.stateProductSelled
                  : classes.stateProductNotSell
              }>
              {data.product_in_site[0]?.status?.name}
            </Box>
          );
        },
      },
      {
        title: 'Giá',
        sorting: false,
        filtering: false,
        render: (data) => {
          return (
            <Box display='inline-flex'>
              {(() => {
                const {
                  public_price,
                  connected_price,
                  vip_price,
                  price_list,
                  price_list_vip,
                } = data?.product_in_site[0] || {};
                if (
                  (isRetail &&
                    !public_price &&
                    !connected_price &&
                    !vip_price) ||
                  (!isRetail && !price_list?.length && !price_list_vip?.length)
                ) {
                  return (
                    <Box component='span' whiteSpace='noWrap'>
                      <Typography variant='body2'>Chưa cập nhật</Typography>
                    </Box>
                  );
                }

                return (
                  <Button
                    onClick={() => {
                      setItemShowPrice(data);
                    }}>
                    <Box component='span' whiteSpace='noWrap'>
                      Xem chi tiết
                    </Box>
                  </Button>
                );
              })()}
            </Box>
          );
        },
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
                  setItemEdit(data);
                }}>
                <Box component='span' color='#0B86D0' whiteSpace='noWrap'>
                  Chỉnh sửa
                </Box>
              </Button>
              <Button
                onClick={() => {
                  handleDeleteProduct(data);
                }}>
                <Box component='span' color='#E35847'>
                  Xóa
                </Box>
              </Button>
            </Box>
          );
        },
      },
    ]);
  }, [initData]);

  const handleSavePrice = () => {
    const submitValue = {};
    Object.keys(updateValue).forEach((key) => {
      if (key !== 'product_in_site_edit') {
        const [pis, connectType, priceType] = key.split('.');
        if (!submitValue[pis]) {
          submitValue[pis] = {};
        }
        if (!submitValue[pis][connectType]) {
          submitValue[pis][connectType] = {};
        }
        submitValue[pis][connectType][priceType] = updateValue[key];
      }
    });
    axiosService
      .patch('/product-in-site/retail', {
        products: submitValue,
      })
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            title: 'Cập nhật thành công',
            icon: 'success',
          });
          setUpdateValue({
            product_in_site_edit: [],
          });
          getData();
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Cập nhật thất bại',
          icon: 'error',
        });
        console.error(err);
      });
  };

  const onSelectFile = (e) => {
    setFileData(e.target.files[0]);
    if (e.target.files[0]) {
      const url = '/product-in-site/import';
      const formData = new FormData();
      const options = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      formData.append('importFile', e.target.files[0]);
      let alertData = {};
      axiosService
        .post(url, formData, options)
        .then(async (res) => {
          if (res.data) {
            const alertData = {
              title: `Đã thêm thành công ${res.data.length} sản phẩm`,
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
              timerProgressBar: true,
            };
            await Swal.fire(alertData);
            setHaveNewImportedProduct(!haveNewImportedProduct);
            return;
          }
          alertData = {
            icon: 'error',
            timer: 3000,
            title: 'Thêm sản phẩm thất bại',
            timerProgressBar: true,
          };
          await Swal.fire(alertData);
        })
        .catch(async (err) => {
          alertData = {
            icon: 'error',
            timer: 3000,
            title: err.response.data.code,
            text: err.response.data.message,
            showConfirmButton: false,
            timerProgressBar: true,
          };
          await Swal.fire(alertData);
        });
    }
  };
  function handleAddProductFileClick() {
    inputFile.current.click();
  }

  function toggleFilter() {
    setOptionsListProduct((state) => ({
      ...state,
      filtering: !state.filtering,
    }));
  }

  return (
    <Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        p={2}>
        <Typography variant='h6'>
          <Box
            fontWeight='bold'
            component='div'
            style={{ textTransform: 'uppercase' }}>
            {tab === 'list' ? 'Quản lý sản phẩm' : 'Cập nhật giá nhanh'}
          </Box>
        </Typography>

        <Box>
          <Box
            display='flex'
            alignItems='center'
            className={classes.groupAction}>
            <Box>
              <Button
                variant='outlined'
                color='primary'
                onClick={handleAddProductFileClick}>
                <Box component='span' display='flex' justifyContent='center'>
                  <Publish />
                  Import
                </Box>
              </Button>
              <input
                type='file'
                style={{ display: 'none' }}
                ref={inputFile}
                onChange={onSelectFile}
                onClick={(e) => (e.target.value = null)}
              />
            </Box>
            <Box ml={1}>
              <ExportExcel
                downloadButton={
                  <Button variant='outlined' color='primary'>
                    <Box
                      component='span'
                      display='flex'
                      justifyContent='center'>
                      <GetApp />
                      Export
                    </Box>
                  </Button>
                }
                data={productData}
              />
            </Box>
            <Box ml={1}>
              <a
                style={{ color: 'inherit' }}
                href={`${ENV_API_ENDPOINT}/product-in-site/import-template`}
                download>
                <Button variant='outlined' color='primary'>
                  <Box component='span' display='flex' justifyContent='center'>
                    <SystemUpdateAltIcon />
                    <Box ml='5px' component='span'>
                      Download template
                    </Box>
                  </Box>
                </Button>
              </a>
            </Box>
          </Box>
        </Box>
      </Box>
      <ListTableProduct
        initData={initData}
        productData={productData}
        setItemShowPrice={setItemShowPrice}
        setItemEdit={setItemEdit}
        handleDeleteProduct={handleDeleteProduct}
        isLoading={isLoading}
        setSelectedSubCategoryId={setSelectedSubCategoryId}
        selectedSubCategoryId={selectedSubCategoryId}
        columns={columnListProduct}
        options={optionsListProduct}
        toggleFilter={toggleFilter}
      />
      <CommonDrawer
        isOpen={!!itemEdit}
        handleClose={() => {
          setItemEdit(null);
        }}
        anchor='bottom'
        isCloseBtn
        // maxWidth='lg'
      >
        <EditProduct
          data={itemEdit}
          initData={initData}
          mySiteId={userData?.site?._id}
          handleClose={() => {
            setItemEdit(null);
          }}
          handleRefeshData={getData}
        />
      </CommonDrawer>

      <DialogWithClose
        isOpen={!!itemShowPrice}
        onClose={() => {
          setItemShowPrice(null);
        }}
        keepMounted
        maxWidth='md'>
        <Box p={4}>
          {itemShowPrice && (
            <Box textAlign='center' mb={1}>
              <Typography variant='h5' color='primary'>
                Bảng giá
              </Typography>
            </Box>
          )}
          {(() => {
            if (!itemShowPrice) return <div></div>;
            const {
              public_price,
              connected_price,
              vip_price,
              price_list,
              price_list_vip,
              wholesail_discount,
              wholesail_discount_vip,
            } = itemShowPrice.product_in_site[0];

            if (isRetail) {
              return (
                <TableContainer
                  component={Paper}
                  className={classes.tableCustom}>
                  <Table size='small' aria-label='a dense table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Đối tượng</TableCell>
                        <TableCell>Giá(đ)</TableCell>
                        <TableCell align='right'>Giảm giá</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component='th' scope='row'>
                          <Typography component='span' variant='body2'>
                            Công khai
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>{`${formatCurrencyVnd(
                          public_price?.price,
                          ''
                        )}`}</TableCell>
                        <TableCell align='right'>
                          <Typography
                            component='span'
                            className={classes.typoPromo}
                            variant='body2'>{` (${
                            public_price?.discount || 0
                          }%)`}</Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component='th' scope='row'>
                          <Typography
                            component='span'
                            className={classes.typoConnected}
                            variant='body2'>
                            Liên kết
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>{`${formatCurrencyVnd(
                          connected_price?.price,
                          ''
                        )}`}</TableCell>
                        <TableCell align='right'>
                          <Typography
                            component='span'
                            className={classes.typoPromo}
                            variant='body2'>{` (${
                            connected_price?.discount || 0
                          }%)`}</Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell component='th' scope='row'>
                          <Typography
                            component='span'
                            className={classes.typoVip}
                            variant='body2'>
                            Vip
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>{`${formatCurrencyVnd(
                          vip_price?.price,
                          ''
                        )}`}</TableCell>

                        <TableCell align='right'>
                          <Typography
                            component='span'
                            className={classes.typoPromo}
                            variant='body2'>{` (${
                            vip_price?.discount || 0
                          }%)`}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              );
            }

            return (
              <TableContainer component={Paper} className={classes.tableCustom}>
                <Table size='small' aria-label='a dense table'>
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
                          <TableCell align='right' rowSpan={price_list.length}>
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
          })()}
        </Box>
      </DialogWithClose>
    </Box>
  );
}
