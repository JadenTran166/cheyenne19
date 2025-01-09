import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    minHeight: "356px",
    padding: theme.spacing(2.5),
    border: "1px solid #9496A5",
    borderRadius: theme.shape.borderRadius,

    display: "flex",
    flexDirection: "column",
    cursor: "pointer",

    "&:hover,&.active": {
      borderColor: theme.palette.primary.light,
    },
    "&.disabled": {
      filter: "grayscale(1) opacity(0.5)",
      borderColor: "#9496A5",
    },
  },
  img: {
    objectFit: "contain",
    objectPosition: "center",
    minHeight: "125px",
    maxWidth: "70%",
    alignSelf: "center",
  },
  description: {
    color: "#9496A5",
  },
  title: {
    fontWeight: "bold",
  },
}));

export default function CommonChoiceBox(props) {
  const classes = useStyles();
  return (
    <Box
      className={`${classes.root} ${props.active && "active"} ${
        props.disabled && "disabled"
      } `}
      boxShadow={props.active ? 1 : 0}
    >
      <img
        draggable="false"
        className={classes.img}
        src={props.imgSrc}
        alt={props.alt}
      />
      <Box mb={2}>
        <Typography className={classes.title} variant="subtitle1">
          {props.title}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography className={classes.description} variant="subtitle2">
          {props.description}
        </Typography>
      </Box>
    </Box>
  );
}

CommonChoiceBox.defaultProps = {
  imgSrc: "",
  alt: "",
  title: "",
  description: "",
  active: false,
  disabled: false,
};

CommonChoiceBox.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};
