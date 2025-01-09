import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import CommonConfirmStatus from "../../components/CommonConfirmStatus";
import GroupImg from "../../components/CreateProduct/GroupImg";
import HRCustom from "../../components/HRCustom";
import PropTypes from "prop-types";
import Information from "./ProductDetail/Information/Information";

export default function PreviewProduct(props) {
  const {
    name,
    description,
    listImg,
    listIngredient,
    country,
    unit,
    category,
    sub_category,
  } = props;

  return (
    <Box width={1}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box display="flex" justifyContent="center" width={1}>
            <Box width={{ xs: "70%", md: "100%" }}>
              <GroupImg listImg={listImg} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={1}>
          <HRCustom vertical />
        </Grid>
        <Grid item xs={12} sm={7}>
          <Box>
            <Typography variant="h4">{name}</Typography>
            <Box my={3}>
              <HRCustom />
            </Box>
            <Typography variant="body1">
              {description ? description : "Chưa có mô tả"}
            </Typography>
            <Box my={3}>
              <HRCustom />
            </Box>
            <Box>
              <Typography variant="body1">
                <Box component="label" style={{ textDecoration: "underline" }}>
                  Thành phần:{" "}
                </Box>
              </Typography>

              {listIngredient.length > 0 &&
                listIngredient.map((item, index) => {
                  let status = "confirm";
                  if (item.importedSiteType === "connected-site") {
                    switch (item.verifiedStatus) {
                      case "pending":
                        status = "noHave";
                        break;
                      case "accept":
                        status = "confirm";
                        break;
                      default:
                        status = "unconfirmed";
                        break;
                    }
                  }

                  return (
                    <Box marginBottom="15px" display="flex" >
                      <Box width={200}>
                        {item.product_id.name}
                      </Box>
                        <CommonConfirmStatus
                          status = {item.supplier ? (item.importedSiteType === 'temp-site' ? 'unconfirmed' : 'confirm') : 'noHave'}
                          // : PropTypes.oneOf(['confirm', 'unconfirmed', 'noHave']),
                          idSite = {item.importedSiteType !== 'temp-site' && (item.supplier && item.supplier.id)}
                          nameSite = {item.supplier ? item.supplier.name : 'Không rõ nguồn gốc'}
                        />
                      </Box>
                  );
                })}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box pt={3}>
            <Information
              country={country}
              unit={unit}
              category={category}
              sub_category={sub_category}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

PreviewProduct.defaultProps = {
  name: "",
  description: "",
  listImg: [],
  listIngredient: [],
  country: "",
  unit: "",
  category: "",
  sub_category: "",
};

PreviewProduct.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  listImg: PropTypes.array.isRequired,
  listIngredient: PropTypes.array,
  country: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  sub_category: PropTypes.string.isRequired,
};
