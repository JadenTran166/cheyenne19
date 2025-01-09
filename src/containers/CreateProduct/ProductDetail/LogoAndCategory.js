import React from "react";
import {
  makeStyles,
  Container,
  Grid,
  Box,
  Paper,
  Button,
} from "@material-ui/core";
import CommonCategories from "./../CommonCategories/CommonCategories";
import logocoopmart from "./../../assets/svg/logocoopmart.svg";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Typography from "@material-ui/core/Typography";
//  /site/product/1
const mate = makeStyles((theme) => ({
  product_detail: {
    padding: "24px 0",
    background: "#E5E5E5",
    "& *": {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;",
    },
  },
  paper: {
    background: "white",
    minHeight: 200,
  },

  title: {
    minHeight: 0,
    background: "unset",
    boxShadow: "unset",
    "& h2": {
      margin: 0,
      padding: 0,
    },
  },

  box_wrapper: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderRadius: "5px",
  },
  box_header: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    marginBottom: 10,
  },
  box_footer: {
    marginTop: 10,
  },
  contiguous_line: {
    position: "absolute",
    bottom: -20,
    left: 0,
    width: "100%",
    height: 1,
    background: "black",
    opacity: 0.1,
  },

  logo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  company_name: {
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  btn_connect_wapper: {
    padding: "0 24px",
  },
  btn_connect: {
    textTransform: "initial",
    fontSize: 16,
  },
}));

export default function LogoAndCategory(props) {
  const classes = mate();
  const {
    logo,
    storeName,
    categories,
    onConnectingSite,
    isConnectedSite,
    currentProduct,
  } = props;

  return (
    <Box className={classes.box_wrapper}>
      <Box className={classes.box_header}>
        <Box className={classes.logo}>
          <img src={logo || ""} alt="logo" />
        </Box>
        <Box className={classes.company_name}>
          <Typography>
            Cửa hàng <strong>{storeName ? storeName : "Coopmart"}</strong>
          </Typography>
          {isConnectedSite ? <CheckCircleOutlineIcon color="primary" /> : ""}
        </Box>
        {!isConnectedSite ? (
          <Box className={classes.btn_connect_wapper}>
            <Button
              className={classes.btn_connect}
              fullWidth={true}
              variant="contained"
              color="primary"
              disabled={isConnectedSite}
              onClick={onConnectingSite}
            >
              Kết nối{" "}
            </Button>
          </Box>
        ) : (
          ""
        )}

        <Box className={classes.contiguous_line}></Box>
      </Box>
      <Box className={classes.box_footer}>
        <CommonCategories categories={categories} />
      </Box>
    </Box>
  );
}
