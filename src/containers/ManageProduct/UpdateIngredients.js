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

  const [data, setData] = useState(() => {
    return props.ingredients?.map(({ product_name, percentage, origin }) => ({
      product_name,
      percentage,
      origin,
      isHasOrigin: !!origin,
    }));
  });
  const [isShowIngre, setIsShowIngre] = useState(props.isShowIngre);
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

  function handleItemChange(key, index) {
    return function (event) {
      let currentData = [...data];
      currentData[index][key] = event.target.value;
      setData(currentData);
    };
  }

  function handleChangIsShowIngre(event) {
    setIsShowIngre(event.target.checked);
  }

  useEffect(() => {
    if (!data.length) {
      handleAddMore();
    }
  }, [data.length]);

  useImperativeHandle(ref, () => ({
    newData: data,
    isShowIngre: isShowIngre,
  }));

  return (
    <div className={classes.root}>
      <Box display='flex' justifyContent='space-between' mb={1.5}>
        <Typography variant='h5' color='primary'>
          Thành phần
        </Typography>
        <FormControlLabel
          value='end'
          control={<Checkbox color='primary' />}
          label='Sản phẩm có thành phần'
          labelPlacement='end'
          onChange={handleChangIsShowIngre}
          checked={isShowIngre}
          disabled={!props.isMy}
        />
      </Box>
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
                  value={product_name}
                  onChange={handleItemChange('product_name', index)}
                  variant='outlined'
                  disabled={!props.isMy}
                />
              </div>
              <div className={classes.ingredientItem}>
                <TextField
                  margin='dense'
                  value={percentage}
                  onChange={handleItemChange('percentage', index)}
                  variant='outlined'
                  type='number'
                  disabled={!props.isMy}
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
                      onChange={handleSelectOrigin(index)}
                      disabled={!props.isMy}>
                      <MenuItem value={false}>Không rõ</MenuItem>
                      <MenuItem value={true}>Từ công ty</MenuItem>
                    </Select>
                  </Box>

                  {isHasOrigin && (
                    <TextField
                      margin='dense'
                      value={origin}
                      onChange={handleItemChange('origin', index)}
                      variant='outlined'
                      fullWidth
                      disabled={!props.isMy}
                    />
                  )}
                </Box>
              </div>
              <div className={classes.ingredientItem}>
                <IconButton
                  color='primary'
                  aria-label='remove icon'
                  onClick={handleRemoveItem(index)}
                  disabled={!props.isMy}>
                  <RemoveCircleIcon />
                </IconButton>
              </div>
            </React.Fragment>
          )
        )}
      </div>
      <Box>
        <Button
          variant='outlined'
          // color="secondary"
          className={classes.button}
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddMore}
          fullWidth
          disabled={!props.isMy}>
          Thêm thành phần
        </Button>
      </Box>
    </div>
  );
});
export default UpdateIngredients;
