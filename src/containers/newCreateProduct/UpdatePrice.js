import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import useUpdatePriceWholesaleHook from 'containers/ManageProduct/useUpdatePriceWholesaleHook';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
const useStyles = makeStyles((theme) => ({
  root: {},
  layout: {
    display: 'grid',
    gridTemplateColumns: '100px auto auto auto 50px',
    gridGap: '5px',
    paddingBottom: theme.spacing(1.5),
  },
  priceItem: {
    display: 'flex',
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
}));
const UpdatePrice = forwardRef((props, ref) => {
  const classes = useStyles();
  const { isRetail } = props;
  const [retailPrice, setRetailPrice] = useState({
    public_price: 0,
    connected_price: 0,
    vip_price: 0,
  });

  const {
    newPriceList,
    handleChangeInput,
    handleAddNew,
    handleRemove,
    validateAll,
    errorList,
  } = useUpdatePriceWholesaleHook([]);

  const {
    newPriceList: newPriceListVip,
    handleChangeInput: handleChangeInputVip,
    handleAddNew: handleAddNewVip,
    handleRemove: handleRemoveVip,
    validateAll: validateAllVip,
    errorList: errorListVip,
  } = useUpdatePriceWholesaleHook([]);

  const handleOnRetailPriceChange = (event, key) => {
    if (event.target.value) {
      const newRetailPrice = {
        ...retailPrice,
        [key]: parseInt(event.target.value),
      };
      setRetailPrice(newRetailPrice);
    }
  };

  useEffect(() => {
    if (!newPriceList.length) {
      handleAddNew();
    }
    if (!newPriceListVip.length) {
      handleAddNewVip();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    newData: isRetail
      ? retailPrice
      : { newPriceList, newPriceListVip, errorList, errorListVip },
  }));

  return (
    <div className={classes.root}>
      <Box display='flex' justifyContent='space-between' mb={1.5}>
        <Typography variant='h5' color='primary'>
          Thông tin bán hàng
        </Typography>
      </Box>
      {isRetail ? (
        <Grid container xs={12}>
          <Grid item xs={4} className={classes.labelWrapper}>
            <Typography>Giá công khai</Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              margin='dense'
              defaultValue={0}
              type='number'
              onChange={(e) => {
                handleOnRetailPriceChange(e, 'public_price');
              }}
              variant='outlined'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>VND</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={4} className={classes.labelWrapper}>
            <Typography>Giá liên kết</Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              margin='dense'
              defaultValue={0}
              type='number'
              onChange={(e) => {
                handleOnRetailPriceChange(e, 'connected_price');
              }}
              variant='outlined'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>VND</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={4} className={classes.labelWrapper}>
            <Typography>Giá Vip</Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              margin='dense'
              defaultValue={0}
              type='number'
              onChange={(e) => {
                handleOnRetailPriceChange(e, 'vip_price');
              }}
              variant='outlined'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>VND</InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      ) : (
        <>
          <Box mb={2}>
            <Typography variant='h6' style={{ marginBottom: '1rem' }}>
              Giá liên kết :{' '}
            </Typography>
            <Box pb={1}>
              <Typography variant='body2'>
                <Box component='span' color='text.secondary'>
                  Giá dành cho các khách hàng đã liên kết với công ty.(đơn giá
                  trên 1 sản phẩm)
                </Box>
              </Typography>
            </Box>
            <div className={classes.layout}>
              <div></div>
              <div>Từ (sản phẩm)</div>
              <div>Đến (sản phẩm)</div>
              <div>Đơn giá</div>
              <div></div>
              {newPriceList.map(({ quantity, to, price }, index) => (
                <React.Fragment key={index}>
                  <Box className={classes.priceItem} pt={2}>
                    Khoảng giá {index + 1}
                  </Box>
                  <div className={classes.priceItem}>
                    <TextField
                      variant='outlined'
                      value={quantity}
                      margin='dense'
                      placeholder='Số  lượng'
                      disabled={index !== 0}
                      onChange={(e) => {
                        handleChangeInput(e.target.value, 'quantity', index);
                      }}
                      error={index !== 0 && errorListVip.includes(index)}
                      InputProps={{ onBlur: validateAll }}
                      type='number'
                    />
                  </div>
                  <div className={classes.priceItem}>
                    <TextField
                      variant='outlined'
                      value={to}
                      margin='dense'
                      placeholder='Số  lượng'
                      onChange={(e) => {
                        handleChangeInput(e.target.value, 'to', index);
                      }}
                      error={index !== 0 && errorListVip.includes(index)}
                      InputProps={{ onBlur: validateAll }}
                      type='number'
                    />
                  </div>
                  <div className={classes.priceItem}>
                    <TextField
                      variant='outlined'
                      value={price}
                      placeholder='Đơn giá'
                      margin='dense'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <b>VND</b>
                          </InputAdornment>
                        ),
                        onBlur: validateAll,
                      }}
                      helperText={
                        index !== 0 && errorList.includes(index) && !price
                          ? 'Vui lòng điền giá'
                          : ''
                      }
                      onChange={(e) => {
                        handleChangeInput(e.target.value, 'price', index);
                      }}
                      error={index !== 0 && errorList.includes(index)}
                    />
                  </div>
                  <div className={classes.priceItem}>
                    <IconButton
                      color='primary'
                      aria-label='remove icon'
                      onClick={() => {
                        handleRemove(index);
                      }}>
                      <RemoveCircleIcon />
                    </IconButton>
                  </div>
                  {errorList.includes(index) && price && (
                    <div style={{ gridArea: `${index + 3} / span 5` }}>
                      <Box>
                        <Typography color='error' variant='body2'>
                          Khoảng giá không hợp lệ.
                        </Typography>
                      </Box>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            {newPriceList.length < 7 && (
              <Box>
                <Button
                  variant='outlined'
                  className={classes.button}
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddNew}
                  fullWidth>
                  Thêm khoảng giá
                </Button>
              </Box>
            )}
          </Box>
          <Box>
            <Typography variant='h6' style={{ marginBottom: '1rem' }}>
              Giá Vip:{' '}
            </Typography>
            <div className={classes.layout}>
              <div></div>
              <div>Từ (sản phẩm)</div>
              <div>Đến (sản phẩm)</div>
              <div>Đơn giá</div>
              <div></div>
              {newPriceListVip.map(({ quantity, to, price }, index) => (
                <React.Fragment key={index}>
                  <Box className={classes.priceItem} pt={2}>
                    Khoảng giá {index + 1}
                  </Box>
                  <div className={classes.priceItem}>
                    <TextField
                      variant='outlined'
                      value={
                        // newPriceList[index - 1]?.to
                        //   ? +newPriceList[index - 1]?.to + 1
                        //   : item.quantity
                        quantity
                      }
                      margin='dense'
                      placeholder='Số  lượng'
                      disabled={index !== 0}
                      onChange={(e) => {
                        handleChangeInputVip(e.target.value, 'quantity', index);
                      }}
                      error={index !== 0 && errorListVip.includes(index)}
                      InputProps={{ onBlur: validateAllVip }}
                      type='number'
                    />
                  </div>
                  <div className={classes.priceItem}>
                    <TextField
                      variant='outlined'
                      value={to}
                      margin='dense'
                      placeholder='Số  lượng'
                      onChange={(e) => {
                        handleChangeInputVip(e.target.value, 'to', index);
                      }}
                      error={index !== 0 && errorListVip.includes(index)}
                      InputProps={{ onBlur: validateAllVip }}
                      type='number'
                    />
                  </div>
                  <div className={classes.priceItem}>
                    <TextField
                      variant='outlined'
                      value={price}
                      placeholder='Đơn giá'
                      margin='dense'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <b>VND</b>
                          </InputAdornment>
                        ),
                        onBlur: validateAllVip,
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
                        index !== 0 && errorListVip.includes(index) && !price
                          ? 'Vui lòng điền giá'
                          : ''
                      }
                      error={index !== 0 && errorListVip.includes(index)}
                    />
                  </div>
                  <div className={classes.priceItem}>
                    <IconButton
                      color='primary'
                      aria-label='remove icon'
                      onClick={() => {
                        handleRemoveVip(index);
                      }}>
                      <RemoveCircleIcon />
                    </IconButton>
                  </div>
                  {errorList.includes(index) && price && (
                    <div style={{ gridArea: `${index + 3} / span 5` }}>
                      <Box>
                        <Typography color='error' variant='body2'>
                          Khoảng giá không hợp lệ.
                        </Typography>
                      </Box>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            {newPriceListVip.length < 7 && (
              <Box>
                <Button
                  variant='outlined'
                  className={classes.button}
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddNewVip}
                  fullWidth>
                  Thêm khoảng giá
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}
    </div>
  );
});
export default UpdatePrice;
