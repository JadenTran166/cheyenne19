import {
  Box,
  Button,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import clsx from 'clsx';
import MaterialTable, { MTableToolbar } from 'material-table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosService from '../../config/axiosService';
import { ENV_GERMANY_ENDPOINT } from '../../env/local';

const useStyle = makeStyles((theme) => {
  return {
    root: {
      fontSize: '0.8rem',
      marginLeft: theme.spacing(2),
      backgroundColor: '#FFFFFF',
      borderRadius: '5px',
    },
    connectedStatus: {
      color: '#2DCF58',
    },
    unconnectedStatus: {
      color: '#E35847',
    },
    button: {
      fontSize: '15px',
      padding: theme.spacing(0.75),
      justifyContent: 'start',
    },
    actions: {
      display: 'grid',
      alignContent: 'center',
      position: 'absolute',
      border: '#FFFFFF 4px solid',
      backgroundColor: '#FFFFFF',
      right: '4.3rem',
      top: '6rem',
    },
    unOpenAction: {
      display: 'none',
    },
    logo: {
      boxSizing: 'border-box',
      border: '1px solid #E9EDEB',
      maxWidth: '100px',
      height: '100px',
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
      },
    },
    productName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100px',
    },
    requestSiteName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '120px',
    },
    productId: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '120px',
    },
    viewSiteButton: {
      color: '#0B86D0',
      textTransform: 'capitalize',
    },
    unlinkButton: {
      color: '#E35847',
      textTransform: 'capitalize',
    },
    paginationBox: {
      marginBottom: theme.spacing(1),
    },
    title: {
      fontWeight: 'bold',
      margin: theme.spacing(0, 0, 0.5, 2),
    },
    tabPanelLabel: {
      textTransform: 'none',
    },
    longLabel: {
      minWidth: '48%',
    },
    customToolbar: {
      '& .MuiToolbar-root': {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2, 2, 2, 2),
        '& .MuiTextField-root': {
          width: '100%',
        },
      },
    },
  };
});

export default function Item(props) {
  const [connectedIngredientList, setConnectedIngredientList] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOpenAction, setIsOpenAction] = useState('');
  useEffect(() => {
    getIngredientProductList();
  }, [isUpdated, props.subCategoryFilter]);
  const history = useHistory();
  const classes = useStyle();
  const [siteItems, setSiteItems] = useState({
    total: 0,
    currentPage: 1,
    limit: 4,
    count: 0,
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const getIngredientProductList = () => {
    axiosService
      .get('/product-as-ingredient', {
        limit: siteItems.limit,
        page: siteItems.currentPage,
        status: 'pending',
        sub_category: props.subCategoryFilter,
      })
      .then((res) => {
        const data = res.data;
        const ingredients = data.ingredientsFilter;
        const paging = data.paging;
        const count =
          paging.total % siteItems.limit !== 0
            ? paging.total < siteItems.limit
              ? 1
              : (paging.total - (paging.total % siteItems.limit)) /
                  siteItems.limit +
                1
            : paging.total / siteItems.limit;
        setSiteItems({
          ...siteItems,
          currentPage: parseInt(paging.page),
          total: paging.total,
        });
        let items = [];
        ingredients.map((i) => {
          if (i.verifiedStatus)
            items.push({
              requestId: i._id,
              productId: i.product_id._id,
              ingredientId: i._id,
              productName: i.product_id.name,
              siteName: i.supplier.name,
              connectedDate: moment(i.updated_at).format('DD/MM/YYYY'),
            });
        });
        setConnectedIngredientList(items);
      });
  };

  const handleAcceptConnection = (ingredientId, siteName) => {
    axiosService
      .post('ingredient-in-site/verify-confirm', {
        ingredient_ids: [ingredientId],
        confirm_value: 'accept',
      })
      .then((res) => {
        if (res) {
          const alertData = {
            title: `Chấp nhận kết nối nguyên liệu với trang ${siteName} thành công `,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          };
          Swal.fire(alertData);
          setIsUpdated(!isUpdated);
        }
      });
  };
  const handleSelectTab = (e, value) => {
    setSelectedTab(value);
  };
  const handleRejectConnection = (ingredientId, siteName) => {
    axiosService
      .post('ingredient-in-site/verify-confirm', {
        ingredient_ids: [ingredientId],
        confirm_value: 'refuse',
      })
      .then((res) => {
        if (res) {
          const alertData = {
            title: `Từ chối kết nối nguyên liệu với trang ${siteName} thành công `,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          };
          Swal.fire(alertData);
          setIsUpdated(!isUpdated);
        }
      });
  };

  const setStateAndRerender = (stateChange) => {
    stateChange();
    setIsUpdated(!isUpdated);
  };
  const handleClickActions = (itemId) => {
    setIsOpenAction(itemId);
  };
  const getActions = (data) => {
    return (
      <div className={classes.actions}>
        <Button
          color='primary'
          className={clsx(classes.button, classes.viewSiteButton)}
          onClick={() => {
            handleAcceptConnection(data.ingredientId, data.siteName);
          }}>
          Đồng ý
        </Button>
        <Button
          color='primary'
          className={clsx(classes.button, classes.unlinkButton)}
          onClick={() => {
            handleRejectConnection(data.ingredientId, data.siteName);
          }}>
          Từ chối
        </Button>
      </div>
    );
  };
  const columns = [
    {
      title: 'Mã sản phẩm',
      field: 'productId',
      render: (data) => {
        return <Typography>{data.productId.slice(-6)}</Typography>;
      },
    },
    {
      title: 'Tên sản phẩm',
      field: 'productName',
      render: (data) => {
        return <Typography>{data.productName}</Typography>;
      },
    },
    {
      title: 'Tên site',
      field: 'requestSiteName',
      render: (data) => {
        return <Typography>{data.siteName}</Typography>;
      },
    },
    {
      title: 'Ngày Liên Kết',
      field: 'connectedDate',
      render: (data) => {
        return <Typography>{data.connectedDate}</Typography>;
      },
    },
    {
      title: 'Hành Động',
      field: 'actions',
      render: (data) => {
        return (
          <div>
            <div
              onClick={() => {
                handleClickActions(data.requestId);
              }}>
              <IconButton aria-label='open'>
                <MoreHorizIcon color='primary' />
              </IconButton>
              {isOpenAction === data.requestId ? (
                <div>{getActions(data)}</div>
              ) : (
                ''
              )}
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <ClickAwayListener
        onClickAway={() => {
          handleClickActions('');
        }}
        touchEvent='onTouchStart'>
        <Box className={classes.root}>
          <Typography variant='h6'>
            <Box p={2} fontWeight='bold' component='div'>
              Nguyên liệu đã liên kết
            </Box>
          </Typography>
          <Tabs
            value={selectedTab}
            indicatorColor='primary'
            textColor='primary'
            onChange={handleSelectTab}>
            <Tab className={classes.tabPanelLabel} label='Danh sách yêu cầu' />
            <Tab className={classes.tabPanelLabel} label='Yêu cầu đã gửi' />
            <Tab
              className={clsx(classes.tabPanelLabel, classes.longLabel)}
              label='Sản phẩm được lấy làm nguyên liệu'
            />
          </Tabs>
          {selectedTab === 0 ? (
            <MaterialTable
              columns={columns}
              data={connectedIngredientList}
              totalCount={siteItems.total}
              options={{
                pageSize: 5,
                headerStyle: {
                  fontWeight: 'bold',
                },
                searchFieldVariant: 'outlined',
                searchFieldStyle: {
                  width: '100%',
                },
                grouping: false,
                showTextRowsSelected: false,
                showSelectAllCheckbox: false,
                searchFieldAlignment: 'left',
                showTitle: false,
                selection: false,
                sorting: false,
              }}
              components={{
                Toolbar: (props) => (
                  <div className={classes.customToolbar}>
                    <MTableToolbar {...props} color='secondary' />
                  </div>
                ),
                Container: (props) => <Paper {...props} elevation={0} />,
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: 'Chưa có dữ liệu',
                },
              }}
            />
          ) : (
            <Typography>
              Chức năng đang được phát triển <ErrorOutlineIcon />
            </Typography>
          )}
        </Box>
      </ClickAwayListener>
    </div>
  );
}
