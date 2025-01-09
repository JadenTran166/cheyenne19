import React, { Component } from 'react';
import {
  Grid,
  Box,
  withStyles,
  Typography,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import CommonQuantityControl from '../CommonQuantityControl/CommonQuantityControl';
import PropTypes from 'prop-types';
import defaultImg from '../../assets/img/default_img.png';
import {
  ASSETS_ENDPOINT,
  formatCurrencyVnd,
  getPriceData,
  replaceImg,
} from '../../constants/common';
import { isArray } from 'lodash';
import { ENV_GERMANY_ENDPOINT } from 'env/local';

const styled = withStyles((theme) => ({
  root: {
    // padding: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  header: {
    background: '#FBFBFB',
    padding: theme.spacing(3),
  },
  body: {
    padding: theme.spacing(1),
  },
  media: {
    maxWidth: 100,
  },
  siteText: {
    textDecoration: 'inherit',
  },
  selectOption: {
    maxHeight: 40,
    width: 250,
  },
  itemProduct: {
    padding: theme.spacing(2, 0),
    minWidth: '992px',
  },
  hw100: {
    height: '100%',
    width: '100%',
  },
  nameProduct: {
    textDecoration: 'none',
  },
}));

class CartItem extends Component {
  render() {
    const {
      classes,
      productInCart,
      onDeleteProduct,
      onChangeQuantiy,
      onCheck,
      disableEdit,
    } = this.props;
    let allSite = {};

    if (productInCart) {
      productInCart.forEach((element) => {
        const { id, name } = element.product_in_site.site;
        allSite[id] = {
          name,
          product_in_site: [],
        };
      });

      productInCart.forEach((element) => {
        const { site, product_price, quantity } = element.product_in_site;
        const price_list = isArray(product_price)
          ? [...product_price]
          : [{ ...product_price, quantity: 1 }];

        const { price, discount, discountPrice, totalPriceDiscount } =
          getPriceData(element.product_in_site, site, quantity);

        allSite[site._id].product_in_site = [
          ...allSite[site._id].product_in_site,
          {
            id: element.product_in_site.product._id,
            product_in_site_id: element.product_in_site._id,
            name: element.product_in_site.product.name,
            quantity,
            discountPrice,
            discount,
            price,
            totalPrice: totalPriceDiscount,
            is_check: element.product_in_site.is_check,
            img: element.product_in_site.product.imgs
              ? element.product_in_site.product.imgs.length > 0
                ? ASSETS_ENDPOINT + element.product_in_site.product.imgs[0].link
                : defaultImg
              : defaultImg,
            limitQuantity: price_list[0].quantity,
          },
        ];
      });
    }
    const allKeySite = Object.keys(allSite);
    return (
      <Container>
        <Grid container className={classes.root}>
          {allKeySite.length > 0
            ? allKeySite.map((item, index) => (
                <Box
                  width='100%'
                  boxShadow={3}
                  key={index}
                  marginTop='20px'
                  style={
                    this.props.disablePaymentMethod ? { marginBottom: 30 } : {}
                  }>
                  <Grid item xs={12}>
                    <Box
                      width='100%'
                      className={classes.header}
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'>
                      <Box
                        style={{cursor: 'pointer', textDecoration: 'underline'}}
                        onClick={() => {
                          window.location.href =
                            `${ENV_GERMANY_ENDPOINT}site/` + item;
                        }}>
                        <Typography
                          color='primary'
                          variant='h5'
                          className={classes.siteText}>
                          {allSite[item].name}
                        </Typography>
                      </Box>
                      {!this.props.disablePaymentMethod && (
                        <FormControl
                          variant='outlined'
                          className={classes.selectOption}>
                          <InputLabel id='payment-method'>
                            Phương thức
                          </InputLabel>
                          <Select
                            labelId='payment-method'
                            id='payment'
                            name='payment-method'
                            value={10}
                            label='Payment Method'
                            className={classes.hw100}>
                            <MenuItem value={10}>
                              Thanh toán khi nhận hàng
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={
                      this.props.disablePaymentMethod
                        ? { background: '#f7f7f7' }
                        : {}
                    }>
                    <Box
                      width='100%'
                      className={classes.body}
                      key={index}
                      overflow='auto'>
                      {allSite[item].product_in_site
                        ? allSite[item].product_in_site.map(
                            (product, index) => {
                              return (
                                <Grid
                                  container
                                  key={index}
                                  className={classes.itemProduct}>
                                  <Grid item xs={5}>
                                    <Box
                                      width='100%'
                                      display='flex'
                                      alignItems='start'>
                                      <Checkbox
                                        checked={product.is_check}
                                        disabled={
                                          product.price && product.price < 0
                                        }
                                        inputProps={{
                                          'aria-label': 'primary checkbox',
                                        }}
                                        color='primary'
                                        onChange={() =>
                                          onCheck(product.product_in_site_id)
                                        }
                                      />
                                      <img
                                        src={product.img}
                                        alt={product.name}
                                        className={classes.media}
                                        onError={replaceImg}
                                      />
                                      <Box padding='10px'>
                                        <Box
                                          className={classes.nameProduct}
                                          style={{cursor: 'pointer'}}
                                          onClick={() => {
                                            window.location.href =
                                              `${ENV_GERMANY_ENDPOINT}product/` +
                                              product.product_in_site_id;
                                          }}>
                                          <Typography
                                            variant='body1'
                                            color='textPrimary'>
                                            {product.name}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Grid container>
                                      <Grid item xs={3}>
                                        <Box
                                          width='100%'
                                          display='flex'
                                          alignItems='center'
                                          mt={1}>
                                          <Typography
                                            variant='body1'
                                            color='primary'>
                                            {product.price && product.price < 0
                                              ? ''
                                              : formatCurrencyVnd(
                                                  product.price
                                                )}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={2}>
                                        <Box
                                          width='100%'
                                          display='flex'
                                          alignItems='center'
                                          justifyContent='flex-start'
                                          mt={1}>
                                          <CommonQuantityControl
                                            disabled={disableEdit}
                                            minValue={product.limitQuantity}
                                            value={product.quantity}
                                            getValue={(quantity) => {
                                              onChangeQuantiy(
                                                product.product_in_site_id,
                                                quantity
                                              );
                                            }}
                                          />
                                        </Box>
                                      </Grid>
                                      <Grid item xs={2}>
                                        <Box
                                          width='100%'
                                          display='flex'
                                          alignItems='center'
                                          justifyContent='center'
                                          mt={1}>
                                          <Typography
                                            variant='body1'
                                            color='primary'>
                                            {product.discount &&
                                            product.discount < 0
                                              ? ''
                                              : `${product.discount}%`}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={3}>
                                        <Box
                                          width='100%'
                                          display='flex'
                                          alignItems='center'
                                          justifyContent='center'
                                          mt={1}>
                                          <Typography
                                            variant='body1'
                                            color='primary'>
                                            {product.price && product.price < 0
                                              ? 'Liên kết với cửa hàng để xem giá'
                                              : formatCurrencyVnd(
                                                  product.totalPrice
                                                )}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={2}>
                                        <Box
                                          width='100%'
                                          display='flex'
                                          alignItems='center'
                                          mt={1}>
                                          {!disableEdit && (
                                            <Button
                                              onClick={() =>
                                                onDeleteProduct(
                                                  product.product_in_site_id
                                                )
                                              }>
                                              Xóa
                                            </Button>
                                          )}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              );
                            }
                          )
                        : ''}
                    </Box>
                  </Grid>
                </Box>
              ))
            : ''}
        </Grid>
      </Container>
    );
  }
}

export default styled(CartItem);

CartItem.propTypes = {
  productInCart: PropTypes.array,
  onDeleteProduct: PropTypes.func,
  onChangeQuantiy: PropTypes.func,
  onCheck: PropTypes.func,
};
