import { Box, Container, Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MaterialTable, { MTableToolbar } from 'material-table';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import axiosService from '../../config/axiosService';
import { ENV_API_ENDPOINT, ENV_ASSETS_ENDPOINT } from '../../env/local';
import { convertArrayToObject } from '../../utils';
import Menu from './Menu';
const useStyles = makeStyles((theme) => ({
  customToolbar: {
    '& .MuiToolbar-root': {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2, 0, 2, 0),
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
  root: {
    // padding: theme.spacing(1, 7),
    paddingTop: theme.spacing(2),
    backgroundColor: '#F7F7F7',
    width: '100%',
    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: theme.palette.primary.main,
    },
  },
  product_img: {
    height: '74px',
    width: '74px',
    objectFit: 'cover',
  },
  rightSection: {
    padding: theme.spacing(0, 2),
    marginBottom: theme.spacing(3),
  },
}));

const CopyProduct = (props) => {
  const tableRef = useRef(null);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [initData, setInitData] = useState({
    products: [],
    category: [],
    sub_category: [],
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  useEffect(() => {
    getInitData();
  }, [selectedSubCategoryId]);

  const getInitData = async () => {
    try {
      const requestAllProduct = axiosService.get(
        `${ENV_API_ENDPOINT}/product-in-site-connected`
      ,{sub_category: selectedSubCategoryId});
      const requestCategory = axiosService.get(`${ENV_API_ENDPOINT}/category`);
      const [productData, categoryData] = await Promise.all([
        requestAllProduct.then((res) => res.data.products),
        requestCategory.then((res) => res.data),
      ]);
      setInitData({
        products: productData,
        category: categoryData,
        sub_category: convertArrayToObject(categoryData, 'id'),
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRow = (rows) => {
    setSelectedProducts(rows.map((item) => item.id));
  };

  const clearSelectedProducts = () => {
    // setSelectedProducts()
    tableRef.current.onAllSelected(false);
  };

  const copySelectedProducts = () => {
    axiosService
      .post('/product-in-site', {
        products: [...selectedProducts],
      })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Copy sản phẩm thành công',
        });
        getInitData();
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: err.response.message || 'Copy sản phẩm thất bại',
        });
      });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.root}>
        <Grid item lg={3} md={3} xs={3}>
          <Menu
            isSelected={selectedProducts.length > 0}
            onClear={clearSelectedProducts}
            onCopy={copySelectedProducts}
            setSelectedSubCategoryId={setSelectedSubCategoryId}
          />
        </Grid>
        <Grid item lg={9} md={9} xs={9}>
          <Paper className={classes.rightSection}>
            <Box>
              <MaterialTable
                tableRef={tableRef}
                columns={[
                  {
                    title: 'Mã sản phẩm',
                    field: 'id',
                    render: (data) => {
                      return data.id.slice(-6);
                    },
                  },
                  {
                    title: 'Hình ảnh',
                    field: 'img',
                    render: (data) => {
                      return (
                        <img
                          className={classes.product_img}
                          src={
                            data?.product?.imgs[0]
                              ? ENV_ASSETS_ENDPOINT +
                                '/' +
                                data?.product?.imgs[0].link
                              : ''
                          }
                        />
                      );
                    },
                  },
                  { title: 'Tên sản phẩm', field: 'product.name' },
                  { title: 'Tên công ty', field: 'site.name' },
                ]}
                isLoading={isLoading}
                data={initData.products}
                // editable={{
                //   onRowAdd: async (newData) =>
                //     await handleCreateIngredients(newData.product_id.name),
                // }}
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
                  showSelectAllCheckbox: false,
                  searchFieldAlignment: 'left',
                  showTitle: false,
                  selection: true,
                }}
                components={{
                  Toolbar: (props) => (
                    <div className={classes.customToolbar}>
                      <MTableToolbar {...props} color='secondary' />
                    </div>
                  ),
                  Container: (props) => <Paper {...props} elevation={0} />,
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: 'Chưa có sản phẩm',
                  },
                }}
                onSelectionChange={handleSelectRow}
                showSelectAllCheckbox={true}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default CopyProduct;
