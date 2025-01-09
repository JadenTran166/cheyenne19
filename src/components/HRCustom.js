import { makeStyles } from "@material-ui/core";
import React from "react";
const useStyles = makeStyles((theme) => ({
  vertical: {
    height: "100%",
    width: "1px",
    border: 0,
    borderLeft: "1px solid #E9EDEB",
  },
  horizontal: {
    border: 0,
    borderTop: "1px solid #E9EDEB",
  },
}));
export default function HRCustom({ vertical }) {
  const classes = useStyles();
  if (vertical) {
    return <hr className={classes.vertical} />;
  }
  return <hr className={classes.horizontal} />;
}
