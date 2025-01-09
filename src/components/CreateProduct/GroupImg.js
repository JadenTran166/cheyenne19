import { Box, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import CommonImg from "../CommonImg";
import PropTypes from "prop-types";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(3, 1fr)",
    position: "relative",
    gridGap: "5px 2px",
  },
  item: {
    // position: "relative",
    width: "100%",
    // border: 1px solid #ccc;
    // paddingTop: "100%",

    "&:nth-child(1)": {
      gridColumn: "1 / 4",
      gridRow: "1 / 4",
    },
  },
}));
export default function GroupImg(props) {
  const classes = useStyles();
  const [active, setActive] = useState(0);
  let { listImg } = props;

  // listImg = [
  //   "https://toplist.vn/images/800px/omo-95282.jpg",
  //   "https://nutifood.com.vn/uploads/products/1553047173.png",
  //   "http://cheyenne19.com/static/media/mh.7b72ba4f.svg",
  // ];
  return (
    <Box width={1} className={classes.root}>
      <CommonImg
        size="100%"
        src={listImg[active]}
        className={classes.item}
        isZoom
      />
      {/* <Box display="flex" width={1} justifyContent="space-between">
        
      </Box> */}
      {listImg.length > 1 &&
        listImg.map((item, index) => (
          <Box key={index} onClick={() => setActive(index)}>
            <CommonImg
              src={item}
              className={classes.item}
              isActive={index === active}
            />
          </Box>
        ))}
    </Box>
  );
}

GroupImg.defaultProps = {
  listImg: [],
};

GroupImg.propTypes = {
  listImg: PropTypes.array.isRequired,
};
