import {
  Box,
  Button,
  Grid,
  List,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
import MuiListItem from '@material-ui/core/ListItem';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductCate, updateProductSubCate } from 'slice/productSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'white',
  },
  arrowIcon: {
    fontSize: '0.9rem',
  },
  arrowIconHover: {
    fontSize: '0.9rem',
    color: 'red',
  },
  iconWrapper: {
    display: 'flex',
  },
  demo: {
    overflowY: 'scroll',
    maxHeight: 320,
    height: 320,
    borderRight: `1px solid ${theme.palette.grey[300]}`,
  },
  selectedItem: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  default: {
    color: theme.palette.grey[700],
  },
  noData: {
    height: 320,
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const ListItem = withStyles((theme) => ({
  root: {
    '&$selected': {
      backgroundColor: 'white',
      color: 'red',
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
      cursor: 'pointer',
    },
  },
  selected: {},
}))(MuiListItem);

export default function CategorySelector(props) {
  const classes = useStyles();
  const { category, sub_category, validateStep1 } = props;
  const [selectedSubList, setSelectedSubList] = useState([]);
  const createProductData = useSelector((state) => state.product);
  const { productCate, productSubCate } = createProductData;
  const dispatch = useDispatch();

  const handleOnCategorySelect = (cate) => {
    dispatch(updateProductCate(cate));
    const selectedCateFullData = sub_category[cate._id];
    setSelectedSubList(
      selectedCateFullData ? selectedCateFullData.sub_category || [] : []
    );
    dispatch(updateProductSubCate({}));
    validateStep1('category', cate);
  };

  const handleOnSubCategorySelect = (subCate) => {
    dispatch(updateProductSubCate(subCate));
    validateStep1('sub_category', subCate);
  };

  const renderListCategory = (data, handleOnClick, mappingData) => {
    return (
      <Box className={classes.demo} p={2}>
        {data && data.length > 0 && (
          <List dense>
            {data.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  onClick={() => {
                    handleOnClick(item);
                  }}
                  selected={item._id === mappingData._id}>
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction className={classes.iconWrapper}>
                    <ArrowForwardIosIcon
                      className={
                        item._id === mappingData._id
                          ? classes.arrowIconHover
                          : classes.arrowIcon
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    );
  };

  useEffect(() => {
    const selectedCateFullData = sub_category[productCate?._id];
    setSelectedSubList(
      selectedCateFullData ? selectedCateFullData.sub_category || [] : []
    );
  }, []);

  return (
    <>
      <Box>
        {category && category.length > 0 ? (
          <Grid
            container
            className={classes.root}
            p={2}
            style={{ marginBottom: '1rem' }}>
            <Grid item xs={6}>
              {renderListCategory(
                category,
                handleOnCategorySelect,
                productCate
              )}
            </Grid>
            <Grid item xs={6}>
              {renderListCategory(
                selectedSubList,
                handleOnSubCategorySelect,
                productSubCate
              )}
            </Grid>
          </Grid>
        ) : (
          <Box className={classes.noData}>Không có danh mục phù hợp</Box>
        )}
        <Box display='flex'>
          <Typography style={{ marginRight: '1rem' }}>Đã chọn :</Typography>
          {productCate?.name ? (
            <Typography className={classes.selectedItem}>
              {productCate?.name}{' '}
              {productSubCate?.name ? `> ${productSubCate.name}` : ''}
            </Typography>
          ) : (
            <Typography className={classes.default}>
              Chưa chọn ngành hàng
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
