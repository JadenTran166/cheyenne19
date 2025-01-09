import {
  Box,
  Grid,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { isNumber } from 'lodash';
import React, {
  forwardRef,
  useCallback,
  useState,
  useImperativeHandle,
  useEffect,
} from 'react';
import axiosService from '../../config/axiosService';

const inputData = [
  {
    key: 'public_price',
    keyPromo: 'public_promo',
    title: 'Giá công khai (public)',
    description:
      'Giá dành cho tất cả mọi người, bất kì ai cũng có thể nhìn thấy giá tiền này.',
    priceInput: 'Giá công khai',
    promo: 'Giảm giá',
    helperText: 'Vui lòng nhập giá',
  },
  {
    key: 'connected_price',
    keyPromo: 'connected_promo',
    title: 'Giá liên kết (connected)',
    description: 'Giá dành cho các khách hàng đã liên kết với công ty.',
    priceInput: 'Giá liên kết',
    promo: 'Giảm giá',
    helperText: 'Vui lòng nhập giá',
  },
  {
    key: 'vip_price',
    keyPromo: 'vip_promo',
    title: 'Giá đặc biệt (vip)',
    description:
      'Giá dành cho các khách hàng thuộc danh sách đặc biệt của công ty.',
    priceInput: 'Giá đặc biệt',
    promo: 'Giảm giá',
    helperText: 'Vui lòng nhập giá',
  },
];

const UpdatePrice = forwardRef((props, ref) => {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState(() => {
    const { connected_price, public_price, vip_price } =
      props.data.product_in_site[0];
    return {
      public_price: public_price?.price || '',
      public_promo: public_price?.discount || '',
      connected_price: connected_price?.price || '',
      connected_promo: connected_price?.discount || '',
      vip_price: vip_price?.price || '',
      vip_promo: vip_price?.discount || '',
    };
  });
  const handleChangeInput = useCallback(
    (item) => (e) => {
      if (isNaN(Number(e.target.value))) return;

      setFormData({
        ...formData,
        [item.key]: e.target.value,
      });
    },
    [formData]
  );
  const handleChangeInputPromo = useCallback(
    (item) => (e) => {
      if (isNaN(Number(e.target.value))) return;
      setFormData({
        ...formData,
        [item.keyPromo]: e.target.value,
      });
    },
    [formData]
  );

  const getListInput = useCallback(() => {
    return inputData.map((item) => {
      const {
        key,
        title,
        description,
        priceInput,
        promo,
        helperText,
        keyPromo,
      } = item;
      const isError = errors.includes(key);

      return (
        <Box key={key} pb={1}>
          <Box pb={1}>
            <Link component='span' variant='body2' underline='always'>
              <Typography variant='body1'>{title}</Typography>
            </Link>
          </Box>
          <Box pb={1}>
            <Typography variant='body2'>
              <Box component='span' color='text.secondary'>
                {description}
              </Box>
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                error={isError}
                id={key + '_price'}
                label={priceInput}
                helperText={isError ? helperText : ''}
                variant='outlined'
                value={formData[key]}
                margin='dense'
                onChange={handleChangeInput(item)}
                InputProps={{
                  // type: "number",
                  endAdornment: (
                    <InputAdornment position='end'>
                      <b>VND</b>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                error={isError}
                id={key + '_promo'}
                label={promo}
                helperText={isError ? helperText : ''}
                variant='outlined'
                margin='dense'
                value={formData[keyPromo]}
                onChange={handleChangeInputPromo(item)}
                InputProps={{
                  // type: "number",
                  endAdornment: (
                    <InputAdornment position='end'>
                      <b>%</b>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>
      );
    });
  }, [errors, handleChangeInput, formData]);

  const saveUpdatePrice = () => {
    props.handleUpdatePrice(formData);
  };

  useEffect(() => {
    props.handleUpdatePrice(formData);
  }, [formData]);

  useImperativeHandle(ref, () => ({
    saveUpdatePrice,
  }));

  return (
    <Box>
      <Typography variant='h6'>Giá bán</Typography>
      {getListInput()}
    </Box>
  );
});
export default UpdatePrice;
