import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  Link,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React, {
  forwardRef,
  useCallback,
  useState,
  useImperativeHandle,
} from 'react';
import axiosService from '../../config/axiosService';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useEffect } from 'react';
import useUpdatePriceWholesaleHook from './useUpdatePriceWholesaleHook';

const useStyle = makeStyles((theme) => ({
  addicon: {
    cursor: 'pointer',
    '& .MuiIconButton-colorPrimary': {
      color: '#2DCF58',
    },

    '& .MuiTypography-root.MuiTypography-body1': {
      color: '#2DCF58',
      textDecoration: 'underline',
    },
  },
}));

const UpdatePriceWholesale = forwardRef((props, ref) => {
  const {
    price_list,
    price_list_vip,
    wholesail_discount,
    wholesail_discount_vip,
  } = props.data.product_in_site[0];

  const classes = useStyle();
  const {
    newPriceList,
    handleChangeInput,
    handleAddNew,
    handleRemove,
    validateAll,
    errorList,
  } = useUpdatePriceWholesaleHook(price_list);

  const {
    newPriceList: newPriceListVip,
    handleChangeInput: handleChangeInputVip,
    handleAddNew: handleAddNewVip,
    handleRemove: handleRemoveVip,
    validateAll: validateAllVip,
    errorList: errorListVip,
  } = useUpdatePriceWholesaleHook(price_list_vip);

  useEffect(() => {
    props.handleUpdatePriceList(newPriceList);
  }, [newPriceList]);

  // VIP

  const [promoState, setPromoState] = useState(wholesail_discount || '');
  const [promoVipState, setPromoVipState] = useState(
    wholesail_discount_vip || ''
  );

  useEffect(() => {
    props.handleUpdatePriceListVip(newPriceListVip);
  }, [newPriceListVip]);

  useEffect(() => {
    props.handleChangePromo('promo', promoState);
  }, [promoState]);
  useEffect(() => {
    props.handleChangePromo('promo_vip', promoVipState);
  }, [promoVipState]);

  useImperativeHandle(ref, () => ({
    errorList,
    errorListVip,
  }));

  return (
    <Box>
      <Typography variant='h6'>Bảng giá</Typography>
      <Box pb={1}>
        <Box
          pb={1}
          display='flex'
          justifyContent='space-between'
          alignItems='center'>
          <Link
            component='span'
            variant='body2'
            underline='always'
            color='initial'>
            <Typography variant='body1'>Giá liên kết (connected)</Typography>
          </Link>
          <TextField
            variant='outlined'
            value={promoState}
            placeholder='Giảm giá'
            margin='dense'
            onChange={(e) => {
              const { value } = e.target;
              if (isNaN(Number(value))) return;
              if (Number(value) > 100) return;
              setPromoState(Number(value));
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <b>%</b>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box pb={1}>
          <Typography variant='body2'>
            <Box component='span' color='text.secondary'>
              Giá dành cho các khách hàng đã liên kết với công ty.(đơn giá trên
              1 sản phẩm)
            </Box>
          </Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={2}></Grid>
          <Grid item xs={3}>
            <Typography variant='subtitle1'>Từ (sản phẩm)</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant='subtitle1'>Đến (sản phẩm)</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant='subtitle1'>Đơn giá</Typography>
          </Grid>
          <Grid item xs={1}></Grid>

          {newPriceList.map((item, index) => (
            <React.Fragment key={`count_${index}`}>
              <Grid item xs={2}>
                <Box pt={1} clone>
                  <Typography variant='subtitle1'>
                    Khoảng giá {index + 1}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant='outlined'
                  value={item.quantity}
                  margin='dense'
                  placeholder='Số  lượng'
                  disabled={index !== 0}
                  onChange={(e) => {
                    handleChangeInput(e.target.value, 'quantity', index);
                  }}
                  error={errorList.includes(index)}
                  // InputProps={{ onBlur: validateAll }}
                  type='number'
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant='outlined'
                  value={item.to}
                  margin='dense'
                  placeholder='Số  lượng'
                  onChange={(e) => {
                    handleChangeInput(e.target.value, 'to', index);
                  }}
                  error={errorList.includes(index)}
                  // InputProps={{ onBlur: validateAll }}
                  type='number'
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant='outlined'
                  value={item.price}
                  placeholder='Đơn giá'
                  margin='dense'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <b>VND</b>
                      </InputAdornment>
                    ),
                    // onBlur: validateAll,
                  }}
                  onChange={(e) => {
                    handleChangeInput(e.target.value, 'price', index);
                  }}
                  helperText={
                    errorList.includes(index) && !item.price
                      ? 'Vui lòng điền giá'
                      : ''
                  }
                  error={errorList.includes(index)}
                />
              </Grid>

              <Grid item xs={1}>
                <Box
                  display='flex'
                  alignItems='center'
                  pt={1}
                  justifyContent='center'>
                  <IconButton
                    size='small'
                    onClick={() => {
                      handleRemove(index);
                    }}>
                    <RemoveCircleIcon fontSize='large' />
                  </IconButton>
                </Box>
              </Grid>
              {errorList.includes(index) && item.price && (
                <Grid item xs={12}>
                  <Box>
                    <Typography color='error' variant='body2'>
                      Khoảng giá không hợp lệ.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </React.Fragment>
          ))}

          <Grid item xs={12}>
            <Box
              display='inline-flex'
              alignItems='center'
              height='100%'
              className={classes.addicon}
              onClick={() => {
                handleAddNew();
              }}>
              <IconButton size='small' color='primary'>
                <AddCircleIcon fontSize='large' />
              </IconButton>
              <Typography>Thêm đơn giá</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box pb={1}>
        <Box
          pb={1}
          display='flex'
          justifyContent='space-between'
          alignItems='center'>
          <Link
            component='span'
            variant='body2'
            underline='always'
            color='initial'>
            <Typography variant='body1'>Giá đặc biệt (vip)</Typography>
          </Link>
          <TextField
            variant='outlined'
            value={promoVipState}
            placeholder='Giảm giá'
            onChange={(e) => {
              const { value } = e.target;
              if (isNaN(Number(value))) return;
              if (Number(value) > 100) return;

              setPromoVipState(Number(value));
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <b>%</b>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box pb={1}>
          <Typography variant='body2'>
            <Box component='span' color='text.secondary'>
              Giá dành cho các khách hàng thuộc danh sách đặc biệt của công ty.
            </Box>
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {newPriceListVip.map((item, index) => (
            <React.Fragment key={`count_${index}`}>
              <Grid item xs={2}>
                <Box pt={1} clone>
                  <Typography variant='subtitle1'>
                    Khoảng giá {index + 1}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant='outlined'
                  value={
                    // newPriceList[index - 1]?.to
                    //   ? +newPriceList[index - 1]?.to + 1
                    //   : item.quantity
                    item.quantity
                  }
                  margin='dense'
                  placeholder='Số  lượng'
                  disabled={index !== 0}
                  onChange={(e) => {
                    handleChangeInputVip(e.target.value, 'quantity', index);
                  }}
                  error={errorListVip.includes(index)}
                  // helperText={
                  //   errorListVip.includes(index)
                  //     ? 'Khoảng giá trị không hợp lệ'
                  //     : ''
                  // }
                  // InputProps={{ onBlur: validateAllVip }}
                  type='number'
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant='outlined'
                  value={item.to}
                  margin='dense'
                  placeholder='Số  lượng'
                  onChange={(e) => {
                    handleChangeInputVip(e.target.value, 'to', index);
                  }}
                  error={errorListVip.includes(index)}
                  // helperText={
                  //   errorListVip.includes(index)
                  //     ? 'Khoảng giá trị không hợp lệ'
                  //     : ''
                  // }
                  // InputProps={{ onBlur: validateAllVip }}
                  type='number'
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant='outlined'
                  value={item.price}
                  placeholder='Đơn giá'
                  margin='dense'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <b>VND</b>
                      </InputAdornment>
                    ),
                    // onBlur: validateAllVip,
                  }}
                  onChange={(e) => {
                    handleChangeInputVip(e.target.value, 'price', index);
                  }}
                  // helperText={
                  //   errorListVip.includes(index)
                  //     ? 'Số tiền sau phải lớn hơn số tiền trước'
                  //     : ''
                  // }

                  helperText={
                    errorListVip.includes(index) && !item.price
                      ? 'Vui lòng điền giá'
                      : ''
                  }
                  error={errorListVip.includes(index)}
                />
              </Grid>

              <Grid item xs={1}>
                <Box
                  display='flex'
                  alignItems='center'
                  pt={1}
                  justifyContent='center'>
                  <IconButton
                    size='small'
                    onClick={() => {
                      handleRemoveVip(index);
                    }}>
                    <RemoveCircleIcon fontSize='large' />
                  </IconButton>
                </Box>
              </Grid>
              {errorListVip.includes(index) && item.price && (
                <Grid item xs={12}>
                  <Box>
                    <Typography color='error' variant='body2'>
                      Khoảng giá không hợp lệ.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </React.Fragment>
          ))}

          <Grid item xs={12}>
            <Box
              display='inline-flex'
              alignItems='center'
              height='100%'
              className={classes.addicon}
              onClick={() => {
                handleAddNewVip();
              }}>
              <IconButton size='small' color='primary'>
                <AddCircleIcon fontSize='large' />
              </IconButton>
              <Typography>Thêm đơn giá</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});
export default UpdatePriceWholesale;
