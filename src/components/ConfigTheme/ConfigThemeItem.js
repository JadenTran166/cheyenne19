import { Box, ButtonBase, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  border: {
    padding: theme.spacing(0.3),
    borderWidth: "4px",
    border: "3px solid",
    borderRadius: theme.shape.borderRadius,
    borderColor: (props) =>
      props.isActive ? props.secondaryColor : "transparent",
  },
  item: {
    width: "67px",
    height: "67px",
    backgroundColor: (props) => props.primaryColor,
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    position: "relative",
  },
  rect: {
    position: "absolute",
    width: "90%",
    height: "90%",
    backgroundColor: (props) => props.secondaryColor,
    bottom: 0,
    right: 0,
    transform: "rotateZ(45deg) translate(80%, 0%)",
  },
}));

export default function ConfigThemeItem(props) {
  const classes = useStyles(props);
  return (
    <Box className={classes.border}>
      <ButtonBase className={classes.item}>
        <div className={classes.rect}></div>
      </ButtonBase>
    </Box>
  );
}
