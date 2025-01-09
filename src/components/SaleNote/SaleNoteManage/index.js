import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CartItem from 'components/CartItem';
import Researcher from 'components/CommonSiteProduct/Researcher';
import axiosService from 'config/axiosService';
import { USER_ROLE } from 'constants/common';
import { ENV_GERMANY_ENDPOINT } from 'env/local';
import { debounce, find, isArray } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateCartTotalProduct } from 'slice/cartSlice';
import Swal from 'sweetalert2';
import { AlertModal, ConfirmDialog } from '../../AlertModal/AlertModal';

const useStyle = makeStyles((theme) => {
  return {
    root: {
      borderRadius: '5px',
      padding: '0 25px',
    },
    toolbar: {
      padding: 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addCartButton: {
      width: 240,
      height: 50,
      marginRight: 10,
    },
    goToCart: {
      width: 240,
      height: 50,
    },
    name: {
      fontWeight: 'bold',
    },
  };
});
export function SaleNoteManage(props) {
  const classes = useStyle();
  const history = useHistory();
  const [saleNotes, setSaleNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const userData = useSelector((state) => state?.user?.userData);
  const isSeller = !!userData?.site;
  const dispatch = useDispatch();

  const { selectedUser, filterCategoryId } = props;

  const countFetch = useRef(0);

  const handleSendDelete = (id) => {
    axiosService
      .delete(`/memo-paper/${id}`, {}, {})
      .then((res) => {
        getInitData();
      })
      .catch((err) => {
        enqueueSnackbar(
          err.response ? err.response.data.message : 'Không thể xử lý yêu cầu',
          {
            variant: 'error',
          }
        );
        // props.dispatchAlertBox.closeAlertBox();
      });
  };

  const handleDeleteProduct = debounce((id) => {
    const messageTrigger = {
      title: 'Bạn có muốn xóa sản phẩm',
      text: '',
      icon: 'warning',
      preConfirm: {
        handleSendDelete: handleSendDelete,
        id,
      },
    };
    ConfirmDialog(messageTrigger);
  }, 300);

  const checkQuantity = (product, quantity) => {
    let price_list = isArray(product?.product_price)
      ? [...product?.product_price]
      : [{ ...product?.product_price, quantity: 1 }];

    if (price_list && price_list.length > 0) {
      let listPrice = price_list;
      listPrice.sort(function (item1, item2) {
        return item1.quantity - item2.quantity;
      });
      if (quantity < listPrice[0].quantity) {
        return false;
      }
    }
    return true;
  };

  const handleChangeQuantity = debounce((id, quantity) => {
    let data = saleNotes.find(
      (element) =>
        element.product_in_site._id === id && element.quantity !== quantity
    );
    if (data !== undefined) {
      if (checkQuantity(data, quantity)) {
        axiosService
          .patch(
            '/memo-paper',
            {
              product_in_site_id: id,
              quantity: quantity,
            },
            {}
          )
          .then((res) => {
            handleDataInSaleNote(res);
          })
          .catch((err) => {
            enqueueSnackbar(
              err.response
                ? err.response.data.message
                : 'Không thể xử lý yêu cầu!',
              {
                variant: 'error',
              }
            );
          });
      } else {
        const messageTrigger = {
          title: 'Số lượng sản phẩm đã chọn chưa đạt số lượng tối thiểu!',
          timer: 2500,
          icon: 'warning',
        };

        AlertModal(messageTrigger);
      }
    }
  }, 500);

  const getSummary = (note) => {
    let summary = 0,
      i = 0;
    for (const product of note) {
      if (note[i].product_in_site.is_check === true) {
        summary += product.quantity;
      }
      i++;
    }
    return summary;
  };

  const handleOnCheckAll = (e) => {
    setIsCheckAll(e.target.checked);
    if (saleNotes && saleNotes.length > 0) {
      const newSaleNotes = saleNotes.map((product) => {
        const { product_price } = product.product_in_site;
        if (
          product_price &&
          Object.keys(product_price).length === 0 &&
          Object.getPrototypeOf(product_price) === Object.prototype
        ) {
          product.product_in_site.is_check = false;
        } else {
          product.product_in_site.is_check = e.target.checked;
        }
        return product;
      });
      let summary = getSummary(newSaleNotes);
      setSaleNotes(newSaleNotes);
      setSummary(summary);
    }
  };

  const handleInputSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 500);

  const verifyCheckAll = (saleNotes) => {
    const isNotChecked = find(saleNotes, (product) => {
      return !product.product_in_site.is_check;
    });

    setIsCheckAll(!isNotChecked);
  };

  const handleCheck = (id) => {
    for (let product of saleNotes) {
      if (product.product_in_site._id === id) {
        product.product_in_site.is_check = !product.product_in_site.is_check;
        break;
      }
    }
    let summary = getSummary(saleNotes);
    verifyCheckAll(saleNotes);
    setSummary(summary);
  };
  const handleDataInSaleNote = (res, resetCheck = false) => {
    let saleNoteProducts = res.data?.memo_paper?.product_in_sites || [];
    let listSubActive = [];

    saleNoteProducts = saleNoteProducts.map((product) => {
      const oldStatus = find(
        saleNotes,
        (item) => item?.product_in_site?._id === product._id
      );

      if (product.site?.active_sub_categories) {
        listSubActive = [
          ...listSubActive,
          ...Object.entries(product.site?.active_sub_categories).map(
            ([key, value]) => {
              if (value) {
                return key;
              } else {
                return '';
              }
            }
          ),
        ];
      }

      return {
        product_in_site: {
          ...product,
          is_check: resetCheck
            ? false
            : oldStatus?.product_in_site?.is_check || false,
        },
        quantity: product.quantity,
      };
    });
    if (countFetch.current === 1) {
      props.setListSubCategory([...new Set(listSubActive)]);
    }

    setSaleNotes(saleNoteProducts);
    verifyCheckAll(saleNoteProducts);
    let summary = getSummary(saleNoteProducts);
    setSummary(summary);
    setIsLoading(false);
  };

  const getInitData = () => {
    const categoryFilter =
      filterCategoryId && filterCategoryId.length > 0
        ? filterCategoryId.toString()
        : '';
    setIsLoading(true);
    const url = selectedUser
      ? `/memo-paper/user-shared/${selectedUser}`
      : '/memo-paper';
    axiosService
      .get(url, {
        search,
        filters: [
          {
            filter_type: 'sub_category',
            value: categoryFilter,
          },
        ],
      })
      .then((res) => {
        handleDataInSaleNote(res, true);
        setIsLoading(false);
      })
      .catch((data) => {
        setIsLoading(false);
        if (data?.response?.data?.code === 'ACCESS_DENINED') {
          const messageTrigger = {
            title:
              data.err ||
              `Bạn không có quyền truy cập giấy ghi nhớ của công ty`,
            timer: 1500,
            icon: 'error',
          };
          AlertModal(messageTrigger);
          setTimeout(() => {
            if (selectedUser) {
              history.push('/note');
            } else {
              history.push('/');
            }
          }, 1000);
        } else {
          const messageTrigger = {
            title:
              data.err || `Không thể xem danh sách sản phẩm của giấy ghi nhớ`,
            timer: 1500,
            icon: 'error',
          };
          AlertModal(messageTrigger);
        }
      });
  };

  const fetchBeSharedNotes = () => {
    axiosService
      .get(`/memo-paper/user/shared`, {
        params: { offset: 0, limit: 999 },
      })
      .then((res) => {
        setCurrentUser(
          find(res?.data?.users, (item) => item._id === selectedUser) || null
        );
      })
      .catch((data) => {
        const messageTrigger = {
          title:
            data.err || `Không thể xem danh sách giấy ghi nhớ được chia sẻ`,
          timer: 1500,
          icon: 'error',
        };
        AlertModal(messageTrigger);
      });
  };

  const addProductToCart = () => {
    if (saleNotes && saleNotes.length > 0) {
      Swal.mixin({
        timer: 4000,
        confirmButtonText: 'Tiếp tục',
        cancelButtonText: 'Hủy',
        reverseButtons: true,
      })
        .fire({
          icon: 'info',
          title: `Bạn có chắc muốn thêm vào giỏ hàng ?`,
          showCancelButton: true,
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const checkedProducts = saleNotes
              .filter((item) => item?.product_in_site.is_check)
              .map((item) => {
                return {
                  product_in_site_id: item?.product_in_site?._id,
                  quantity: item?.quantity || 0,
                };
              });

            if (checkedProducts.length > 0) {
              const option = !isSeller
                ? { user_id: selectedUser || userData?._id } || ''
                : {};
              axiosService
                .post(
                  `/memo-paper/cart`,
                  {
                    ...option,
                    product_in_sites: checkedProducts || [],
                  },
                  {}
                )
                .then((res) => {
                  const messageTrigger = {
                    title: `Thêm vào giỏ hàng thành công`,
                    timer: 2000,
                    icon: 'success',
                  };
                  axiosService.get(`/cart`, {}).then((res) => {
                    dispatch(updateCartTotalProduct(res?.data?.quantity || 0));
                    AlertModal(messageTrigger);
                    handleOnCheckAll({ target: { checked: false } });
                  });
                })
                .catch((data) => {
                  const messageTrigger = {
                    title: data.err || `Không thể thêm vào giỏ`,
                    timer: 1500,
                    icon: 'error',
                  };
                  AlertModal(messageTrigger);
                });
            }
          }
        });
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchBeSharedNotes();
    }
  }, [selectedUser]);

  useEffect(() => {
    countFetch.current = countFetch.current + 1;

    getInitData();
  }, [search, filterCategoryId, selectedUser]);

  return (
    <Box className={classes.root}>
      {selectedUser && currentUser && (
        <Box px={3}>
          <Typography variant='h4'>
            Giấy ghi nhớ của{' '}
            <span className={classes.name}>{currentUser?.name || ''}</span>
          </Typography>
        </Box>
      )}
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Researcher
          onChange={(e) => {
            e.persist();
            handleInputSearch(e);
          }}
          placeHolder='Tên sản phẩm bạn muốn tìm'
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} className={classes.toolbar}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isCheckAll}
              disabled={saleNotes.length === 0}
              onChange={handleOnCheckAll}
              name='checkedB'
              color='primary'
            />
          }
          label={`Sản phẩm (${summary})`}
        />
        <Button
          variant='contained'
          color='primary'
          disabled={!summary}
          className={classes.addCartButton}
          onClick={addProductToCart}>
          Thêm nhanh vào giỏ
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        // style={{ padding: '0 20px' }}
      >
        {isLoading ? (
          <Box
            width='100%'
            height='50vh'
            display='flex'
            justifyContent='center'
            alignItems='center'>
            <CircularProgress />
          </Box>
        ) : saleNotes && saleNotes.length > 0 ? (
          <CartItem
            productInCart={saleNotes}
            onDeleteProduct={handleDeleteProduct}
            onChangeQuantiy={handleChangeQuantity}
            onCheck={handleCheck}
            disablePaymentMethod
            disableEdit={
              (!isSeller && selectedUser) ||
              (isSeller && userData?.role !== USER_ROLE.OWNER)
            }
          />
        ) : (
          <Box
            width='100%'
            height='50vh'
            display='flex'
            justifyContent='center'
            alignItems='center'>
            <Typography>Giấy ghi nhớ rỗng</Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
}
