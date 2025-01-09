import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductInfo } from 'slice/productSlice';
import { InputAdornment } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {},
  layout: {
    display: 'grid',
    gridTemplateColumns: '100px auto auto auto 50px',
    gridGap: '5px',
    paddingBottom: theme.spacing(1.5),
  },
  ingredientItem: {
    display: 'flex',
    alignItems: 'center',

    '& .MuiFormControl-marginDense': {
      margin: 0,
    },
  },
  rowItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
const UpdateNutritional = forwardRef((props, ref) => {
  const classes = useStyles();
  const createProductData = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { have_nutritional_ingredients, nutritional_ingredients } =
    createProductData;

  const handleOnCheck = (event) => {
    dispatch(
      updateProductInfo({ have_nutritional_ingredients: event.target.checked })
    );
  };

  const handleOnValueChange = (event, key) => {
    if (have_nutritional_ingredients) {
      let currentItem = [...nutritional_ingredients];
      currentItem[key] = {
        ...currentItem[key],
        value: parseInt(event.target.value),
      };
      dispatch(updateProductInfo({ nutritional_ingredients: currentItem }));
    }
  };

  return (
    <div className={classes.root}>
      <Box display='flex' justifyContent='space-between' mb={1.5}>
        <Typography variant='h5' color='primary'>
          Thành phần dinh dưỡng
        </Typography>
        <FormControlLabel
          //   checked={have_ingredients}
          value='end'
          control={<Checkbox color='primary' />}
          label='Sản phẩm có thành phần dinh dưỡng'
          labelPlacement='end'
          onChange={(e) => {
            handleOnCheck(e);
          }}
        />
      </Box>
      {have_nutritional_ingredients && (
        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={3}>
            {nutritional_ingredients.map((item, index) => {
              return (
                <Grid item xs={6} key={item.key}>
                  <Grid item container xs={12}>
                    <Grid item xs={5} className={classes.rowItem}>
                      <Typography>{item?.label || ''}</Typography>
                    </Grid>
                    <Grid item xs={7} className={classes.rowItem}>
                      <TextField
                        // inputProps={{ min: 0, style: { textAlign: 'center' } }}
                        margin='dense'
                        defaultValue={item?.value || 0}
                        variant='outlined'
                        onChange={(e) => {
                          handleOnValueChange(e, index);
                        }}
                        type='number'
                        InputProps={{
                          style: { maxWidth: 200 },
                          endAdornment: (
                            <InputAdornment position='end'>
                              {item.unit}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
    </div>
  );
});
export default UpdateNutritional;
