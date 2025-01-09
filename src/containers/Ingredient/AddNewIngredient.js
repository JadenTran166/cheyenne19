import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import useUserData from 'hooks/useUserData';
import { noop } from 'lodash';
import MaterialTable, { MTableToolbar } from 'material-table';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import axiosService from '../../config/axiosService';
import { ENV_ASSETS_ENDPOINT } from '../../env/local';

const filterValue = [
  {
    value: 'my-site',
    label: 'Của chính bạn',
  },
  {
    value: 'connected-site',
    label: 'Cửa hàng đã liên kết',
  },
  {
    value: 'temp-site',
    label: 'Của trang tạm',
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: 30,
  },
  text: {
    marginBottom: 20,
  },
  formControl: {
    width: '100%',
    marginBottom: 20,
  },
  buttonGroup: {
    marginTop: 20,
  },
  product_img: {
    height: '74px',
    width: '74px',
    objectFit: 'cover',
  },
}));

export default function AddNewIngredient(props) {
  const { siteType, handleClose, fetchIngredient } = props;
  const currentType = filterValue.filter((va) => va.value === siteType)[0];
  const classes = useStyles();
  const [siteOption, setsiteOption] = React.useState(currentType);
  const [siteList, setSiteList] = React.useState([]);
  const [selectedSite, setSelectedSite] = React.useState();
  const [productList, setProductList] = React.useState([]);
  const [selectedProductList, setSelectedProductList] = React.useState([]);
  const { userData } = useUserData();
  const getConnectedSites = useCallback(async () => {
    axiosService
      .get('/connect', {})
      .then((res) => {
        if (res.status === 200) {
          setSiteList(res.data.connected_site);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getTempSites = useCallback(async () => {
    axiosService
      .get('/temp/site', {})
      .then((res) => {
        if (res.status === 200) {
          setSiteList(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const getListProduct = (value) => {
    if (
      siteOption.value === 'connected-site' ||
      siteOption.value === 'my-site'
    ) {
      axiosService
        .get('/product-in-site', {
          site: value === 'owner' ? userData.site.id : value,
          limit: 999,
          page: 1,
          useAsIngredient: true,
        })
        .then((res) => {
          const table_data = res.data.products.map((prod) => {
            return {
              id: prod.id,
              img: prod.imgs ? prod.imgs[0].link : '',
              name: prod.name,
            };
          });
          setProductList(table_data);
        });
    } else if (siteOption.value === 'temp-site') {
      axiosService
        .get('/product-in-temp-site', {
          temp_site: value,
          limit: 999,
          page: 1,
          useAsIngredient: true,
        })
        .then((res) => {
          setProductList(
            res.data.products.map((prod) => {
              return {
                id: prod.product.id,
                img: prod.product.imgs ? prod.product.imgs[0].link : '',
                name: prod.product.name,
              };
            })
          );
        });
    }
  };

  const handleSiteTypeChange = (event) => {
    setSelectedSite(null);
    setProductList([]);
    setSelectedProductList([]);
    const newType = filterValue.filter(
      (va) => va.value === event.target.value
    )[0];
    setsiteOption(newType);
    if (newType.value === 'connected-site') {
      getConnectedSites();
    } else if (newType.value === 'temp-site') {
      getTempSites();
    } else {
      getListProduct('owner');
    }
  };
  const handleSelectSite = (event) => {
    setSelectedSite(event.target.value);
    getListProduct(event.target.value);
  };
  useEffect(() => {
    setSelectedSite(null);
    setProductList([]);
    setSelectedProductList([]);
    const newType = filterValue.filter((va) => va.value === siteType)[0];
    setsiteOption(newType);
    if (siteType === 'connected-site') {
      getConnectedSites();
    } else if (siteType === 'temp-site') {
      getTempSites();
    } else {
      getListProduct('owner');
    }
  }, [siteType]);

  const handleSelectRow = (data, rowData) => {
    setSelectedProductList(data.map((prod) => prod.id));
  };

  const handleSubmit = () => {
    axiosService
      .post('/ingredient-in-site', {
        imported_site_type: siteOption.value,
        product_list: selectedProductList,
        imported_site_id:
          siteOption.value === 'my-site' ? userData.site.id : selectedSite,
      })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Thêm nguyên liệu thành công',
        });
        handleClose();
        fetchIngredient();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: err.response.message || 'Thêm nguyên liệu thất bại',
        });
        handleClose();
      });
  };
  return (
    <Box pt={3.5} className={classes.root} px={6}>
      <Typography variant='h6' className={classes.text}>
        Thêm Nguyên Liệu
      </Typography>
      <FormControl variant='outlined' className={classes.formControl}>
        <InputLabel id='demo-simple-select-outlined-label'>
          {siteOption.label}
        </InputLabel>
        <Select
          labelId='demo-simple-select-outlined-label'
          id='demo-simple-select-outlined'
          value={siteOption.value}
          onChange={handleSiteTypeChange}
          label={siteOption.label}>
          {filterValue.map((item) => {
            return (
              <MenuItem key={item.values} value={item.value}>
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {siteOption.value !== 'my-site' && (
        <FormControl variant='outlined' className={classes.formControl}>
          <InputLabel id='demo-simple-select-outlined-label'>
            {siteOption.label}
          </InputLabel>
          <Select
            labelId='demo-simple-select-outlined-label'
            id='demo-simple-select-outlined'
            value={selectedSite}
            onChange={handleSelectSite}
            placeholder='Tên Site'>
            {siteList.map((item) => {
              return (
                <MenuItem
                  value={item.accept_site ? item.accept_site._id : item._id}>
                  {item.accept_site ? item.accept_site.name : item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
      <MaterialTable
        // tableRef={[]}
        data={[...productList]}
        columns={[
          {
            title: 'Mã sản phẩm',
            field: 'id',
            render: (data) => {
              return data.id.slice(-4);
            },
          },
          { title: 'Tên', field: 'name' },
          {
            title: 'Hình ảnh',
            editable: 'never',
            field: 'img',
            render: (data) => {
              return (
                <img
                  alt=''
                  className={classes.product_img}
                  src={data.img ? ENV_ASSETS_ENDPOINT + '/' + data.img : ''}
                />
              );
            },
          },
        ]}
        title=''
        options={{
          selection: true,
          selectionProps: (data) => {
            return {
              color: 'primary',
            };
          },
          headerStyle: {},
        }}
        onSelectionChange={(data, rowData) => {
          handleSelectRow(data, rowData);
        }}
        components={{
          Toolbar: (props) => (
            <MTableToolbar
              {...props}
              showTextRowsSelected={false}
              color='secondary'
            />
          ),
        }}
      />

      <Box
        display='flex'
        justifyContent='flex-end'
        className={classes.buttonGroup}>
        <Box minWidth='355px'>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant='outlined'
                color='primary'
                onClick={handleClose}>
                <Box py={1}>Hủy bỏ</Box>
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant='contained'
                color='primary'
                disabled={selectedProductList.length <= 0}
                onClick={handleSubmit}
                // onClick={() => handleSaveUpdatePrice()}
              >
                <Box py={1}>Thêm</Box>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

AddNewIngredient.propTypes = {
  siteType: PropTypes.string,
  handleClose: PropTypes.func,
};
AddNewIngredient.defaultProps = {
  siteType: 'my-site',
  handleClose: noop,
};
