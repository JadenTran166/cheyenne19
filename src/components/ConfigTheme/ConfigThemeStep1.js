import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";
const useStyles = makeStyles((theme) => ({
  btnStart: {
    fontSize: "1.375rem",
    width: "340px",
    minHeight: "53px",
  },
}));
export default function ConfigThemeStep1(props) {
  const classes = useStyles();
  return (
    <Box width={{ xs: "100%", sm: "70%", md: "60%" }} textAlign="center">
      <Box mb={3.5}>
        <Typography variant="h6">Thiết lập cơ bản</Typography>
      </Box>
      <Box mb={3.5}>
        <Typography variant="subtitle1">
          Vì đây là lần đầu tiên bạn đăng nhập vào hệ thống riêng của mình, hệ
          thống mong bạn sẽ cài đặt một vài dấu ấn riêng của mình. Bạn có thể bỏ
          qua bước này, hệ thống sẽ tự động áp dụng các cài đặt mặc định (các
          thiết lập có thể thay cập nhật sau này). Nhấn nút phía dưới để bắt đầu
          sử dụng trang của bạn.
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={props.nextStep}
        className={classes.btnStart}
      >
        <Typography>Bắt đầu</Typography>
      </Button>
    </Box>
  );
}
