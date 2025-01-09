import React from "react";
import { Box, Typography } from "@material-ui/core";
import CommonEditBox from "../CommonEditBox";

export default function GroupText(props) {
  const { label, value } = props;

  return (
    // <CommonEditBox spacing={1}>
    <Box color="background.contrastText">
      <Typography variant="h6" component="div">
        <Box fontWeight="400">
          <Box component="span" mr={2}>
            {label}:
          </Box>
          <Box component="span">{value}</Box>
        </Box>
      </Typography>
    </Box>
    // </CommonEditBox>
  );
}
