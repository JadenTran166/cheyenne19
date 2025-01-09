import React, { useRef, useState } from 'react';
import {
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Autocomplete } from '@material-ui/lab';
const useStyles = makeStyles((theme) => ({
  ctnForm: {
    '&.MuiFormControlLabel-labelPlacementTop > .MuiFormControlLabel-label': {
      marginBottom: theme.spacing(1),
    },
  },
  ctnLabelStart: {
    alignItems: 'start',
  },
  customLabel: {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  hiddenLabel: {
    visibility: 'hidden',
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
  listCheckBox: {
    width: '100%',
  },
}));
function FormControlLabelWrapper({
  label,
  labelPlacement,
  isVertical,
  ...controlProps
}) {
  const classes = useStyles();

  return (
    <FormControlLabel
      label={label}
      labelPlacement={labelPlacement}
      control={<Controller {...controlProps} />}
      className={cn({
        [classes.ctnForm]: true,
        [classes.ctnLabelStart]: !isVertical,
      })}
    />
  );
}

function InputWrapper({
  control,
  type,
  option,
  helperText,
  fullWidth,
  radioProps,
  subLabel,
  onClick,
  ...rest
}) {
  const classes = useStyles();

  const [checkedValues, setCheckedValues] = useState(rest.defaultValue);
  const [open, setOpen] = React.useState(false);
  const [isShowPw, setIsShowPw] = React.useState(false);

  const [inputAutocomplete, setInputAutocomplete] = useState('');

  function handleSelectCheckbox(checkedValue) {
    const newCheckedValue = checkedValues?.includes(checkedValue)
      ? checkedValues?.filter((name) => name !== checkedValue)
      : [...(checkedValues ?? []), checkedValue];
    setCheckedValues(newCheckedValue);

    return newCheckedValue;
  }

  function handleClickCollapse() {
    setOpen(!open);
  }

  function toggleShowPassword() {
    setIsShowPw(!isShowPw);
  }

  switch (true) {
    case type === 'checkbox':
      return (
        <FormControlLabelWrapper
          className={classes.ctnLabel}
          type='checkbox'
          control={control}
          render={(props) => (
            <Checkbox
              disabled={!!rest.disabled}
              onChange={(e) => props.onChange(e.target.checked)}
              checked={!!props.value}
              onClick={onClick}
            />
          )}
          {...rest}
        />
      );

    case type === 'checkbox_group':
      return (
        <FormControl className={classes.listCheckBox}>
          <FormLabel
            className={cn({
              [classes.customLabel]: true,
              [classes.hiddenLabel]: subLabel && !rest.label,
              [classes.mb2]: !!subLabel,
            })}>
            {subLabel && !rest.label ? 'hidden-text' : rest.label}
          </FormLabel>
          <List
            component='nav'
            subheader={
              <ListItem button onClick={handleClickCollapse}>
                <ListItemText primary={subLabel} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            }>
            <Collapse in={open} timeout='auto' unmountOnExit>
              {option.map(({ value, label }, index) => (
                <Controller
                  render={({ onChange: onCheckChange }) => {
                    return (
                      <ListItem
                        key={`${value}_${index}`}
                        role={undefined}
                        dense
                        button
                        onClick={() =>
                          onCheckChange(handleSelectCheckbox(value))
                        }>
                        <ListItemIcon>
                          <Checkbox
                            edge='start'
                            disableRipple
                            checked={checkedValues.includes(value)}
                          />
                        </ListItemIcon>
                        <ListItemText primary={label} />
                      </ListItem>
                    );
                  }}
                  key={value}
                  control={control}
                  type='checkbox'
                  {...rest}
                />
              ))}
            </Collapse>
          </List>
        </FormControl>
      );

    case type === 'radio':
      return (
        <FormControlLabelWrapper
          as={
            <RadioGroup aria-label={rest.ariaLabel || ''} row={radioProps?.row}>
              {option &&
                option.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item.value}
                    control={<Radio />}
                    label={item.label}
                  />
                ))}
            </RadioGroup>
          }
          control={control}
          {...rest}
        />
      );
    case type === 'select':
      return (
        <Controller
          render={({ onChange: onCheckChange, value }) => (
            <FormControl
              fullWidth={!!fullWidth}
              variant={rest.variant}
              sx={{ m: 1, minWidth: 120 }}
              margin='dense'>
              <InputLabel id={rest.name + '_label'}>{rest.label}</InputLabel>
              <Select
                disabled={!!rest.disabled}
                label={rest.label}
                labelId={rest.name + '_label'}
                value={value}
                onChange={(e) => onCheckChange(e.target.value)}>
                {option &&
                  option.map((item, index) => (
                    <MenuItem
                      value={item.value}
                      key={index}
                      disabled={item.disabled}>
                      {item.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          control={control}
          helperText={helperText}
          {...rest}
        />
      );
    case type === 'select_and_autocomplete':
      return (
        <Controller
          render={({ onChange: onCheckChange, value }) => (
            <Autocomplete
              value={value}
              onChange={(event, newValue) => {
                onCheckChange(newValue);
              }}
              inputValue={inputAutocomplete}
              onInputChange={(event, newInputValue) => {
                setInputAutocomplete(newInputValue);
              }}
              id={rest.name + '_autocomplete'}
              getOptionLabel={(option) => option.label || ''}
              options={option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin='dense'
                  variant={rest.variant}
                  label={rest.label}
                  inputProps={{
                    ...params.inputProps,
                    autocomplete: 'new-password',
                  }}
                />
              )}
            />
          )}
          control={control}
          helperText={helperText}
          {...rest}
        />
      );
    case type === 'switch':
      return (
        <FormControlLabelWrapper
          render={(props) => (
            <Switch
              disabled={!!rest.disabled}
              onChange={(e) => props.onChange(e.target.checked)}
              checked={!!props.value}
            />
          )}
          type='checkbox'
          control={control}
          {...rest}
        />
      );

    case type === 'password':
      return (
        <Controller
          as={
            <TextField
              type={isShowPw ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={toggleShowPassword}
                      edge='end'>
                      {isShowPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ autocomplete: 'new-password' }}></TextField>
          }
          control={control}
          helperText={helperText}
          fullWidth={!!fullWidth}
          {...rest}
        />
      );

    default:
      delete rest.labelPlacement;
      return (
        <Controller
          as={
            <TextField
              inputProps={{ autocomplete: 'new-password' }}></TextField>
          }
          control={control}
          helperText={helperText}
          fullWidth={!!fullWidth}
          {...rest}
        />
      );
  }
}

InputWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
};
InputWrapper.defaultProps = {};

export default InputWrapper;
