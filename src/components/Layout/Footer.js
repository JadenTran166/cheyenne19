import React from "react";
import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
// import cls from "classnames";

const useStyles = makeStyles((theme) => ({
  footer: {
    minHeight: "94px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex:10
  },
  // content:{
  //   color :
  // }
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <Box textAlign="center" className={classes.footer}>
      <Typography variant="body1">
        About Cheyenne19 With USPrivacy PolicyTerms & ConditionsPress Enquiries
      </Typography>
    </Box>
  );
}
