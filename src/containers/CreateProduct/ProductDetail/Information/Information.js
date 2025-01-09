import React from "react";
import { makeStyles, Grid, Box } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

const paddingSpacing = "24px 24px";

const tableSpacing = "12px";

const pure_color = "#E9EDEB";

const content_color = "#9496A5";

const mate = makeStyles((theme) => ({
  information: {
    padding: paddingSpacing,
  },
  title: {
    fontWeight: "bold",
    backgroundColor: "#E9EDEB",
    padding: tableSpacing,
  },

  event_title: {
    backgroundColor: "#F7F7F7",
  },

  content: {
    padding: tableSpacing,
    paddingLeft: "20px",
    color: content_color,
    "&.darken": {
      backgroundColor: "#F7F7F7",
    },
  },
}));

export default function Information(props) {
  const classes = mate();
  const { country, unit, category, sub_category } = props;
  return (
    <Grid container className={classes.information}>
      <Grid item xs={5} sm={3} md={3}>
        <Typography className={classes.title}>Nguồn gốc:</Typography>
      </Grid>
      <Grid item xs={7} sm={9} md={9} className={`${classes.content} darken`}>
        <Typography>{country}</Typography>
      </Grid>
      <Grid item xs={5} sm={3} md={3}>
        <Typography className={`${classes.title} ${classes.event_title}`}>
          Đơn vị:
        </Typography>
      </Grid>
      <Grid item xs={7} sm={9} md={9}>
        <Typography className={classes.content}>{unit}</Typography>
      </Grid>
      <Grid item xs={5} sm={3} md={3}>
        <Typography className={classes.title}>Danh mục:</Typography>
      </Grid>
      <Grid item xs={7} sm={9} md={9} className={`${classes.content} darken`}>
        <Typography>
          {category && sub_category && `${category} - ${sub_category}`}
        </Typography>
      </Grid>
    </Grid>
  );
}

Information.defaultProps = {
  country: "",
  unit: "",
  category: "",
  sub_category: "",
};

Information.propTypes = {
  country: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  sub_category: PropTypes.string.isRequired,
};
