import {
  Box,
  Button,
  Divider,
  Input,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateProductCate,
  updateProductName,
  updateProductSubCate,
} from 'slice/productSlice';
import CategorySelector from './CategorySelector';

const useStyles = makeStyles((theme) => ({
  note: {
    fontSize: 12,
    color: '#999',
  },
  divider: {
    margin: theme.spacing(3, 0, 3, 0),
  },
  label: {
    minWidth: 150,
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    marginRight: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBox: {
    backgroundColor: theme.palette.grey[200],
  },
}));

export default function FirstStepCreateProduct(props) {
  const classes = useStyles();
  const { category, sub_category, nextStep, isError, validateStep1 } = props;
  const createProductData = useSelector((state) => state.product);
  const [filterCategory, setFilterCategory] = useState(category);
  const { productName, productCate, productSubCate } = createProductData;
  const dispatch = useDispatch();

  const handleChangeInput = (e) => {
    dispatch(updateProductName(e.target.value));
    validateStep1('name', e.target.value);
  };

  const onSearch = (event) => {
    const filterCate = category
      ? category.filter((cate) =>
          cate?.name
            ?.toLowerCase()
            .includes(event?.target?.value?.toLowerCase())
        )
      : [];
    setFilterCategory(event?.target?.value ? filterCate : category);
    dispatch(updateProductCate({}));
    dispatch(updateProductSubCate({}));
    validateStep1('category', '');
  };

  useEffect(() => {
    setFilterCategory(category);
  }, [category]);

  return (
    <>
      <Box minHeight='536px' width={1}>
        <Typography variant='h5'>Thêm 1 sản phẩm mới</Typography>
        <Typography className={classes.note}>
          Vui lòng chọn ngành hàng phù hợp cho sản phẩm của bạn.
        </Typography>
        <Divider className={classes.divider} />
        <Box display='flex' alignItems='center' mb={3}>
          <Typography className={classes.label} align='justify'>
            Tên sản phẩm
          </Typography>
          <TextField
            fullWidth
            error={isError.name}
            id='name'
            label='Nhập tên sản phẩm'
            defaultValue=''
            helperText={isError.name ? 'Vui lòng nhập tên sản phẩm.' : ''}
            variant='outlined'
            value={productName}
            onChange={handleChangeInput}
          />
        </Box>
        <Box className={classes.categoryBox} p={2} mb={2}>
          <Box display='flex' alignItems='center' mb={3}>
            <Box className={classes.search}>
              <Box className={classes.searchIcon}>
                <SearchIcon />
              </Box>
              <Input
                placeholder='Search…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={onSearch}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Box>
            <Typography className={classes.note}>
              Chọn ngành hàng chính xác
            </Typography>
          </Box>
          <CategorySelector
            category={filterCategory}
            sub_category={sub_category}
            validateStep1={validateStep1}
          />
          {isError.category && (
            <Box mt={1}>
              <Typography variant='subtitle1' color='error'>
                Vui lòng chọn đầy đủ danh mục cho sản phẩm!
              </Typography>
            </Box>
          )}
        </Box>
        <Button
          variant='contained'
          disabled={
            !productName || isEmpty(productCate) || isEmpty(productSubCate)
          }
          onClick={nextStep}
          color='primary'>
          Tiếp theo
        </Button>
      </Box>
    </>
  );
}
