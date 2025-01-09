import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React, { useRef, useState } from "react";

import useMyTheme from "../../containers/MultiThemeProvider/hooks/useMyTheme";
import BoxDragDropImage from "../BoxDragDropImage";
import ConfigThemeItem from "./ConfigThemeItem";
import axiosService from "../../config/axiosService";
const useStyles = makeStyles((theme) => ({
  btnStart: {
    fontSize: "1.375rem",
    width: "340px",
    minHeight: "53px",
  },
  btnCancle: {
    fontSize: "1rem",
    textDecoration: "underline",
    minHeight: "53px",
  },
}));

export default function ConfigThemeStep2(props) {
  const { listTheme } = useMyTheme();
  // const listKeyTheme = Object.keys(listTheme);
  const classes = useStyles();

  const inputImg = useRef(null);

  function handleBoxImgClick() {
    inputImg.current.click();
  }
  return (
    <Box
      width={{ xs: "100%", sm: "70%", md: "60%" }}
      textAlign="center"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Box mb={3.5}>
        <Typography variant="h6">Cài đặt giao diện</Typography>
      </Box>
      <Box mb={3.5}>
        <Box mb={3} display="flex" justifyContent="center">
          <BoxDragDropImage
            imgData={props.imgData}
            onClick={handleBoxImgClick}
          />
        </Box>
        <Button variant="contained" color="primary" component="label">
          <Typography variant="subtitle1">
            <Box minWidth="250px" px={3}>
              Upload ảnh đại diện công ty
            </Box>
          </Typography>
          <input
            ref={inputImg}
            type="file"
            style={{ display: "none" }}
            onChange={props.onUpdateAvatar}
            accept="image/*"
          />
        </Button>
      </Box>
      <Box mb={1}>
        <Typography variant="subtitle2">
          Chọn một màu dành riêng cho Trang của bạn
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" mb={3.5}>
        {listTheme &&
          Object.keys(listTheme).map((item) => (
            <Box
              key={item}
              mx={1}
              onClick={() => {
                props.handleThemeClick(item);
              }}
            >
              <ConfigThemeItem
                primaryColor={listTheme[item].primary}
                secondaryColor={listTheme[item].secondary}
                isActive={props.themeActive === item}
              />
            </Box>
          ))}
      </Box>
      <Box display="flex" flexDirection="column" mb={3.5}>
        <Button
          variant="contained"
          color="primary"
          className={classes.btnStart}
          onClick={props.nextStep}
          disabled={props.isDisableNext}
        >
          <Typography>Tiếp theo</Typography>
        </Button>
        <br />
        <Button
          variant="text"
          color="secondary"
          onClick={props.handleCancle}
          className={classes.btnCancle}
        >
          <Typography>Bỏ qua</Typography>
        </Button>
      </Box>
    </Box>
  );
}
