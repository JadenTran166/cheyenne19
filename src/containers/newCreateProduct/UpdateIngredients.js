import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Box,
  makeStyles,
  FormControlLabel,
  Checkbox,
  TextField,
  IconButton,
  Button,
  Typography,
  Select,
  MenuItem,
} from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductInfo } from 'slice/productSlice';
import { debounce, keysIn } from 'lodash';
import { useCallback } from 'react';
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
}));
const UpdateIngredients = forwardRef((props, ref) => {
  const classes = useStyles();
  const createProductData = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { have_ingredients } = createProductData;

  const [data, setData] = useState(() => {
    return props.ingredients?.map(({ product_name, percentage, origin }) => ({
      product_name,
      percentage,
      origin,
      isHasOrigin: !!origin,
    }));
  });

  function handleAddMore() {
    setData([
      ...data,
      {
        product_name: '',
        percentage: 0,
        origin: '',
        isHasOrigin: false,
      },
    ]);
  }

  function handleRemoveItem(index) {
    return function () {
      let currentData = [...data];
      currentData.splice(index, 1);
      setData(currentData);
    };
  }

  function handleSelectOrigin(index) {
    return function (event) {
      let currentData = [...data];
      currentData[index].isHasOrigin = event.target.value;
      setData(currentData);
    };
  }

  const handleOnCheck = (event) => {
    dispatch(updateProductInfo({ have_ingredients: event.target.checked }));
  };

  const handleOnNameChange = (event, key) => {
    let currentItem = [...data];
    currentItem[key] = {
      ...currentItem[key],
      product_name: event.target.value,
    };
    setData(currentItem);
  };

  const handleOnPercentageChange = (event, key) => {
    let currentItem = [...data];
    currentItem[key] = {
      ...currentItem[key],
      percentage: parseInt(event.target.value),
    };
    setData(currentItem);
  };

  const handleOnOriginChange = (event, key) => {
    let currentItem = [...data];
    if (currentItem[key].isHasOrigin) {
      currentItem[key] = {
        ...currentItem[key],
        origin: event.target.value,
      };
      setData(currentItem);
    }
  };

  useEffect(() => {
    if (have_ingredients && !data.length) {
      handleAddMore();
    }
  }, [have_ingredients]);

  useEffect(() => {
    if (!data.length) {
      dispatch(updateProductInfo({ have_ingredients: false }));
    }
  }, [data.length]);

  useImperativeHandle(ref, () => ({
    newData: data,
  }));

  return (
    <div className={classes.root}>
      <Box display='flex' justifyContent='space-between' mb={1.5}>
        <Typography variant='h5' color='primary'>
          Thành phần
        </Typography>
        <FormControlLabel
          checked={have_ingredients}
          value='end'
          control={<Checkbox color='primary' />}
          label='Sản phẩm có thành phần'
          labelPlacement='end'
          onChange={(e) => {
            handleOnCheck(e);
          }}
        />
      </Box>
      {have_ingredients && (
        <>
          <div className={classes.layout}>
            <div></div>
            <div>Tên thành phần</div>
            <div>Tỉ lệ</div>
            <div>Nguồn gốc</div>
            <div></div>
            {data.map(
              ({ product_name, percentage, origin, isHasOrigin }, index) => (
                <React.Fragment key={index}>
                  <div className={classes.ingredientItem}>
                    Thành phần {index + 1}
                  </div>
                  <div className={classes.ingredientItem}>
                    <TextField
                      margin='dense'
                      defaultValue={product_name}
                      onChange={(e) => {
                        handleOnNameChange(e, index);
                      }}
                      variant='outlined'
                    />
                  </div>
                  <div className={classes.ingredientItem}>
                    <TextField
                      margin='dense'
                      defaultValue={percentage}
                      variant='outlined'
                      onChange={(e) => {
                        handleOnPercentageChange(e, index);
                      }}
                      type='number'
                    />
                  </div>
                  <div className={classes.ingredientItem}>
                    <Box display='flex' alignItems='center' width='100%'>
                      <Box mr={0.5} width='100%'>
                        <Select
                          variant='outlined'
                          margin='dense'
                          fullWidth
                          value={isHasOrigin}
                          onChange={handleSelectOrigin(index)}>
                          <MenuItem value={false}>Không rõ</MenuItem>
                          <MenuItem value={true}>Từ công ty</MenuItem>
                        </Select>
                      </Box>

                      {isHasOrigin && (
                        <TextField
                          margin='dense'
                          defaultValue={origin}
                          variant='outlined'
                          onChange={(e) => {
                            handleOnOriginChange(e, index);
                          }}
                          fullWidth
                        />
                      )}
                    </Box>
                  </div>
                  <div className={classes.ingredientItem}>
                    <IconButton
                      color='primary'
                      aria-label='remove icon'
                      onClick={handleRemoveItem(index)}>
                      <RemoveCircleIcon />
                    </IconButton>
                  </div>
                </React.Fragment>
              )
            )}
          </div>
          {data.length < 7 && (
            <Box>
              <Button
                variant='outlined'
                className={classes.button}
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddMore}
                fullWidth>
                Thêm thành phần
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
  );
});
export default UpdateIngredients;
