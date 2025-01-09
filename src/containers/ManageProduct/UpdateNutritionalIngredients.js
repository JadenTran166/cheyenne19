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
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { convertArrayToObject } from 'utils';
const useStyles = makeStyles((theme) => ({
  root: {},
  layout: {
    display: 'grid',
    gridTemplateColumns: '200px 300px',
    gridGap: '5px',
    paddingBottom: theme.spacing(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientItem: {
    width: '100%',
  },
}));
const UpdateNutritionalIngredients = forwardRef((props, ref) => {
  const classes = useStyles();

  const [data, setData] = useState(() => {
    if (props.nutritionalIngredients.length) {
      const myData = convertArrayToObject(props.nutritionalIngredients, 'key');

      return props.nutritionalIngredientsList.map((item) => {
        if (myData[item.key]) {
          return { ...item, value: myData[item.key].value };
        } else {
          return item;
        }
      });
    } else {
      return props.nutritionalIngredientsList;
    }
  });

  const [isShowIngre, setIsShowIngre] = useState(props.isShowNutriIngre);

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

  useImperativeHandle(ref, () => ({
    newData: data,
    isShowIngre: isShowIngre,
  }));

  return (
    <div className={classes.root}>
      <Box display='flex' justifyContent='space-between' mb={1.5}>
        <Typography variant='h5' color='primary'>
          Thành phần dinh dưỡng
        </Typography>
        <FormControlLabel
          value='end'
          control={<Checkbox color='primary' />}
          label='Sản phẩm có thành phần dinh dưỡng'
          labelPlacement='end'
          onChange={handleChangIsShowIngre}
          checked={isShowIngre}
          disabled={!props.isMy}
        />
      </Box>
      <div className={classes.layout}>
        <Typography variant='subtitle1'>Tên thành phần</Typography>
        <Typography variant='subtitle1'>Tỉ lệ</Typography>
        {data.map(({ key, label, unit, value }, index) => (
          <React.Fragment key={index}>
            <Typography variant='body1'>{label}</Typography>
            <div className={classes.ingredientItem}>
              <FormControl variant='outlined' margin='dense' fullWidth>
                <OutlinedInput
                  id={`outlined-adornment-${key}`}
                  value={value}
                  onChange={handleItemChange('value', index)}
                  endAdornment={
                    <InputAdornment position='end'>{unit}</InputAdornment>
                  }
                  aria-describedby={`outlined-adornment-${key}`}
                  inputProps={{
                    'aria-label': key,
                  }}
                  type='number'
                  pattern='([0-9]{1,3}).([0-9]{1,3})'
                  disabled={!props.isMy}
                />
              </FormControl>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});
export default UpdateNutritionalIngredients;
