import {
  Box,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import HRCustom from "../../components/HRCustom";
import { orderStatusColor } from "../../constants/common";

const useStyles = makeStyles((theme) => ({
  ...Object.keys(orderStatusColor).reduce(
    (rs, item) => ({
      ...rs,
      [item]: {
        "& .MuiFormControlLabel-label": {
          color: orderStatusColor[item].color,
        },
      },
    }),
    {}
  ),
}));

const listFilterStatus = {
  pending: {
    value: "Đang xác nhận",
    color: "#ff8400",
  },
  confirmed: {
    value: "Đã xác nhận",
    color: "#33ae10",
  },
  canceled: {
    value: "Đã hủy",
    color: "initial",
  },
  shipping: {
    value: "Đang giao hàng",
    color: "#A4DD74",
  },
  received: {
    value: "Đã nhận",
    color: "#448fea",
  },
};

export default function LeftManageOrder(props) {
  // orderStatus
  const classes = useStyles();

  return (
    <Box>
      {/* <Box p={3}>
        <Box mb={2.5}>
          <Typography variant="body2">
            <Box component="span" fontSize="18px">
              Sắp xếp:
            </Box>
          </Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="body1" style={{ textDecoration: "underline" }}>
            Mới nhất
          </Typography>
        </Box>
        <Typography variant="body1" style={{ textDecoration: "underline" }}>
          Cũ nhất
        </Typography>
      </Box> */}
      <HRCustom />
      <Box p={3}>
        <Typography>
          <Box component="span" fontWeight="400" fontSize="18px">
            Trạng thái
          </Box>
        </Typography>
        <Box>
          {Object.values(props.orderStatus).length > 0 &&
            Object.values(props.orderStatus).map((oF) => {
              return (
                <FormControlLabel
                  key={oF.name}
                  className={classes[oF.name]}
                  control={
                    <Checkbox
                      checked={!!props.checkedState[oF.name]}
                      onChange={props.handleChange}
                      name={oF.name}
                      color="primary"
                    />
                  }
                  label={oF.description}
                />
              );
            })}
        </Box>
      </Box>
    </Box>
  );
}
