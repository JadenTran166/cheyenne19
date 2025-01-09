import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import React, { useRef } from 'react';
import BoxDragDropImage from '../../components/BoxDragDropImage';
import ConfigThemeItem from '../../components/ConfigTheme/ConfigThemeItem';
import useMyTheme from '../../containers/MultiThemeProvider/hooks/useMyTheme';

const useStyles = makeStyles((theme) => ({
  btnStart: {
    maxWidth: '200px',
    fontSize: '1.375rem',
    minHeight: '53px',
    margin: 'auto',
    display: 'block',
  },
  btnCancle: {
    fontSize: '1rem',
    textDecoration: 'underline',
    minHeight: '53px',
  },
}));

export default function EditAvatarAndColor(props) {
  const { listTheme } = useMyTheme();
  const classes = useStyles();

  const inputImg = useRef(null);

  function handleBoxImgClick() {
    inputImg.current.click();
  }
  return (
    <Box py={2}>
      <Box>
        <Box mb={3} display='flex' justifyContent='center'>
          <BoxDragDropImage
            width='200px'
            height='200px'
            imgData={props.imgData}
            onClick={handleBoxImgClick}
          />
        </Box>

        <input
          ref={inputImg}
          type='file'
          style={{ display: 'none' }}
          onChange={props.onUpdateAvatar}
          accept='image/*'
        />
      </Box>
      <Box>
        <Box display='flex' flexWrap='wrap' justifyContent='center' mb={3.5}>
          {listTheme &&
            Object.keys(listTheme).map((item) => (
              <Box
                key={item}
                mx={1}
                onClick={() => {
                  props.handleThemeClick(item);
                }}>
                <ConfigThemeItem
                  primaryColor={listTheme[item].primary}
                  secondaryColor={listTheme[item].secondary}
                  isActive={props.themeActive === item}
                />
              </Box>
            ))}
        </Box>
        <Button
          variant='contained'
          color='primary'
          fullWidth
          className={classes.btnStart}
          onClick={props.nextStep}
          disabled={props.isDisableNext}>
          <Typography>Lưu</Typography>
        </Button>
      </Box>
    </Box>
  );
}
