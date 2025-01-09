import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Box,
  Grid,
  Divider,
  Typography,
  TextField,
  IconButton,
  Button,
  ButtonBase,
  Container,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
const useStyles = makeStyles((theme) => ({
  root: {
    // width: '100%',
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  title: {
    fontWeight: 500,
  },
}));
export default function SubRow(props) {
  const classes = useStyles(props);
  const {
    price_list,
    _id,
    public_price,
    vip_price,
    connected_price,
  } = props.rowData.product_in_site[0];

  const saveData = price_list.map((item) => ({
    quantity: `${item.quantity}`,
    price: `${item.price}`,
  }));
  const savePromoData = {
    discount_public: `${public_price ? public_price.discount : ""}`,
    discount_vip: `${vip_price ? vip_price.discount : ""}`,
    discount_connected: `${connected_price ? connected_price.discount : ""}`,
  };

  const [newPromo, setNewPromo] = useState(savePromoData);

  const [newPriceList, setNewPriceList] = useState(saveData);
  const [isChange, setIsChange] = useState(false);
  const [isChangePromo, setIsChangePromo] = useState(false);

  useEffect(() => {
    if (JSON.stringify(newPriceList) === JSON.stringify(saveData) && isChange) {
      setIsChange(false);
      return;
    }

    if (
      JSON.stringify(newPriceList) !== JSON.stringify(saveData) &&
      !isChange
    ) {
      setIsChange(true);
    }
  }, [newPriceList, saveData]);

  useEffect(() => {
    if (
      JSON.stringify(newPromo) === JSON.stringify(savePromoData) &&
      isChangePromo
    ) {
      setIsChangePromo(false);
      return;
    }

    if (
      JSON.stringify(newPromo) !== JSON.stringify(savePromoData) &&
      !isChangePromo
    ) {
      setIsChangePromo(true);
    }
  }, [newPromo, savePromoData]);

  const handleChangeInput = (value, key, index) => {
    if (isNaN(Number(value))) {
      return;
    }

    const newData = [...newPriceList];
    newData[index] = {
      ...newData[index],
      [key]: `${key === "quantity" ? Number(value) : value}`,
    };

    setNewPriceList(newData);
  };

  const handleAddNew = () => {
    setNewPriceList([...newPriceList, { quantity: 0, price: 0 }]);
  };

  const handleRemove = (index) => {
    const newData = newPriceList.filter((item, i) => i !== index);

    setNewPriceList(newData);
  };

  const handleChangePromotion = (e) => {
    const { name, value } = e.target;
    if (isNaN(Number(value))) {
      return;
    }
    setNewPromo({
      ...newPromo,
      [name]: value,
    });
  };
  return (
    <Box width="100%" display="inline-flex" p={4} className={classes.root}>
      <Box width="100%" p={2}>
        {props.isLe && (
          <>
            <Typography variant="body1" className={classes.title}>
              Promotion
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  name="discount_public"
                  label="Giá công khai"
                  margin="dense"
                  variant="outlined"
                  value={newPromo.discount_public}
                  onChange={handleChangePromotion}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Giá Vip"
                  margin="dense"
                  variant="outlined"
                  name="discount_vip"
                  value={newPromo.discount_vip}
                  onChange={handleChangePromotion}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="discount_connected"
                  label="Giá liên kết"
                  value={newPromo.discount_connected}
                  margin="dense"
                  variant="outlined"
                  onChange={handleChangePromotion}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!isChangePromo}
                  onClick={() => {
                    props.onHandleSavePromotion(_id, newPromo);
                  }}
                >
                  <Box component="span">Lưu</Box>
                </Button>
                <Button
                  variant="text"
                  disabled={!isChangePromo}
                  onClick={() => {
                    setNewPromo(savePromoData);
                  }}
                >
                  <Box component="span">Hủy</Box>
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box width="100%" p={2}>
        {!props.isLe && (
          <>
            <Typography variant="body1" className={classes.title}>
              Pricelist (chỉ áp dụng cho bán sỉ)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Typography variant="body1" className={classes.title}>
                  Số lượng
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="body1" className={classes.title}>
                  Đơn giá
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {newPriceList.map((item, index) => (
                    <React.Fragment key={`count_${index}`}>
                      <Grid item xs={5}>
                        <TextField
                          variant="outlined"
                          value={item.quantity}
                          onChange={(e) => {
                            handleChangeInput(
                              e.target.value,
                              "quantity",
                              index
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          variant="outlined"
                          value={item.price}
                          onChange={(e) => {
                            handleChangeInput(e.target.value, "price", index);
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Box
                          display="flex"
                          alignItems="center"
                          height="100%"
                          justifyContent="center"
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              handleRemove(index);
                            }}
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isChange}
                      onClick={() => {
                        props.onHandleSave(_id, newPriceList);
                      }}
                    >
                      <Box
                        component="span"
                        // style={{ textDecoration: 'underline', textAlign: 'end' }}
                      >
                        Lưu
                      </Box>
                    </Button>
                    <Button
                      variant="text"
                      disabled={!isChange}
                      onClick={() => {
                        setNewPriceList(saveData);
                      }}
                    >
                      <Box component="span">Hủy</Box>
                    </Button>
                  </Grid>
                  <Grid item xs={5}></Grid>
                  <Grid item xs={2}>
                    <Box
                      display="flex"
                      alignItems="center"
                      height="100%"
                      justifyContent="center"
                    >
                      <ButtonBase onClick={handleAddNew}>
                        <AddBoxIcon color="secondary" fontSize="large" />
                      </ButtonBase>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}
