import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";
const useStyles = makeStyles((theme) => ({
  btnEnd: {
    fontSize: "1.375rem",
    width: "340px",
    minHeight: "53px",
  },
}));
export default function ConfigThemeStep3(props) {
  const clasess = useStyles();
  return (
    <Box width={{ xs: "100%", sm: "70%", md: "60%" }} textAlign="center">
      <Box mb={3.5}>
        <Typography variant="h6">Cài đặt giao diện</Typography>
      </Box>
      <Box mb={3.5}>
        <Typography variant="subtitle1">
          Cài đặt giao diện hoàn tất, bạn có thể bắt đầu sử dụng hệ thống quản
          lý Trang của bạn
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={props.handleEndStep}
        className={clasess.btnEnd}
      >
        <Typography>Bắt đầu sử dụng</Typography>
      </Button>
    </Box>
  );
}
