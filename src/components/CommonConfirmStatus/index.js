import React from "react";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { Link,useHistory } from "react-router-dom";
import {ENV_GERMANY_ENDPOINT} from '../../env/local.js';
import PropTypes from "prop-types";
const data = {
  confirm: {
    color: "#70FF65",
  },
  unconfirmed: {
    color: "#FAFF65",
  },
  noHave: {
    color: "#FF6565",
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
  },
  ico: {
    marginRight: theme.spacing(2),
    fontSize: "15px",
    color: (props) => data[props.status].color,
  },
  showName: {
    // fontSize: '18px',
  },
}));

export default function CommonConfirmStatus(props) {
  const classes = useStyles(props);
  const { idSite, nameSite, variantText,isNewTab } = props;
  const history = useHistory();
  function handleLinkTo(){
    if(isNewTab){
    window.open(`${ENV_GERMANY_ENDPOINT}site/${idSite}`);
    }else{
      history.push(`/site/${idSite}`);
    }
  }
  const nameShow =
    nameSite && idSite ? (
      <Link to="#" onClick={handleLinkTo}>
        <Box component="div" textOverflow="ellipsis">
          <Typography variant={variantText} className={classes.showName}>
            {nameSite}
          </Typography>
        </Box>
      </Link>
    ) : (
      <Box component="div" textOverflow="ellipsis">
        <Typography variant={variantText} className={classes.showName}>
          {nameSite}
        </Typography>
      </Box>
    );
  return (
    <div className={classes.root}>
      <FiberManualRecordIcon className={classes.ico} />
      {nameSite && nameShow}
    </div>
  );
}

CommonConfirmStatus.propTypes = {
  status: PropTypes.oneOf(["confirm", "unconfirmed", "noHave"]),
  idSite: PropTypes.string,
  nameSite: PropTypes.string,
  variantText: PropTypes.string,
};

CommonConfirmStatus.defaultProps = {
  status: "noHave",
  idSite: null,
  nameSite: "",
  variantText: "body1",
  isNewTab : false,
};
