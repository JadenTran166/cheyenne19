import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Zoom,
} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import clsx from 'clsx';
import Loading from 'components/Layout/Loading';
import MaterialTable, { MTableToolbar } from 'material-table';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import axiosService from '../../../config/axiosService';

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
      color: theme.palette.info.main,
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
      top: '-40px',
      left: 0,
      border: '#F5F5F5 4px solid',
      backgroundColor: '#F5F5F5',
      marginTop: theme.spacing(-2),
      boxShadow: '3px 3px 3px 3px #F5F5F5',
    },
    unOpenAction: {
      display: 'none',
    },
    logo: {
      boxSizing: 'border-box',
      border: '1px solid #E9EDEB',
      minWidth: '100px',
      height: '100px',
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
      },
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
    customToolbar: {
      '& .MuiToolbar-root': {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(0, 2, 2, 2),
        '& .MuiTextField-root': {
          width: '100%',
        },
      },
    },
    vipStatus: {
      color: '#f20d0d',
    },
  };
});

export default function Item(props) {
  const [connectedSiteList, setConnectedSiteList] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOpenAction, setIsOpenAction] = useState('');

  const [options, setOptions] = useState({
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
    searchText: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  const { subCategoryFilter } = props;
  useEffect(() => {
    getSitesList();
  }, [isUpdated, subCategoryFilter]);
  const classes = useStyle();
  const [siteItems, setSiteItems] = useState({
    total: 0,
    currentPage: 1,
    limit: 100,
  });
  const getSitesList = () => {
    axiosService
      .get(
        '/be-connected',
        {
          client: true,
          page: siteItems.currentPage,
          limit: siteItems.limit,
          sub_category: subCategoryFilter,
        },
        {}
      )
      .then((res) => {
        const data = res.data;
        const sites = data.connected_site;
        const paging = res.data.paging;
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

        sites.map((site) => {
          const userInfo = site.user;
          items.push({
            id: site._id,
            name: userInfo.name,
            connectedStatus: site.status === 'accepted',
            connectedDate: moment(site.updated_at).format('DD/MM/YYYY'),
            userId: userInfo._id,
            isVip: site.is_vip,
          });
        });
        if (params?.id) {
          const findItem = items.find((item) => item.userId === params.id);
          if (findItem) {
            setOptions((value) => {
              return { ...value, searchText: findItem.name };
            });
          }
        }
        setConnectedSiteList(items);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAcceptConnection = (userId, userName) => {
    axiosService
      .post(
        '/connect/accept',
        {
          request_id: userId,
        },
        {}
      )
      .then((res) => {
        if (!res) Swal.fire('Cập Nhật thất bại');
        const alertData = {
          title: `Chấp nhận kết nối với user ${userName} thành công `,
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        };
        Swal.fire(alertData);
        setIsUpdated(!isUpdated);
      })
      .catch((error) => {
        const alertData = {
          title: error.response.data.message,
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        };
        Swal.fire(alertData);
      });
  };
  const handleUnlinkOnClick = (userId, siteName) => {
    axiosService.get('/my-site').then((res) => {
      const data = res.data;
      axiosService
        .delete(
          '/connect',
          {
            request_id: userId,
            accept_site_id: data.site._id,
          },
          {}
        )
        .then((res) => {
          const alertData = {
            title: `Hủy kết nối với trang ${siteName} thành công `,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          };
          Swal.fire(alertData);
          setIsUpdated(!isUpdated);
        });
    });
  };
  const handleRejectConnection = (requestedId, siteName) => {
    axiosService.get('/my-site').then((res) => {
      const data = res?.data?.site;
      axiosService
        .delete(
          '/connect',
          { request_id: requestedId, accept_site_id: data._id },
          {}
        )
        .then((res) => {
          const alertData = {
            title: `Từ chối kết nối với trang ${siteName} thành công `,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          };
          Swal.fire(alertData);
          setIsUpdated(!isUpdated);
        });
    });
  };
  const handleUpgradeVip = (userId, siteName) => {
    const user_ids = [];
    user_ids.push(userId);
    axiosService
      .post('/connect/update-vip', {
        user_ids: user_ids,
      })
      .then((res) => {
        let alertData = {};
        if (!res.site_ids) {
          alertData = {
            title: `Nâng cấp khách hàng ${siteName} thành công `,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          };
        } else {
          alertData = {
            title: `Nâng cấp khách hàng ${siteName} thất bại`,
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          };
        }
        Swal.fire(alertData);
        setIsUpdated(!isUpdated);
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
    return data.connectedStatus ? (
      <div className={classes.actions}>
        <Button
          color='primary'
          className={clsx(classes.button, classes.unlinkButton)}
          onClick={() => {
            handleUnlinkOnClick(data.userId, data.name);
          }}>
          Hủy liên kết
        </Button>
        {data.isVip ? (
          ''
        ) : (
          <Button
            color='primary'
            className={classes.button}
            onClick={() => {
              handleUpgradeVip(data.userId, data.name);
            }}>
            Nâng cấp
          </Button>
        )}
      </div>
    ) : (
      <div className={classes.actions}>
        <Button
          color='primary'
          className={clsx(classes.button, classes.viewSiteButton)}
          onClick={() => {
            handleAcceptConnection(data.userId, data.name);
          }}>
          Chấp nhận
        </Button>
        <Button
          color='primary'
          className={clsx(classes.button, classes.unlinkButton)}
          onClick={() => {
            handleRejectConnection(data.userId, data.name);
          }}>
          Từ chối
        </Button>
      </div>
    );
  };
  const columns = [
    {
      title: 'Tên người dùng',
      field: 'name',
      render: (data) => {
        return <div>{data.name}</div>;
      },
    },
    {
      title: 'Trạng thái',
      field: 'connectedStatus',
      render: (data) => {
        return (
          <div
            className={
              data.connectedStatus
                ? data.isVip
                  ? classes.vipStatus
                  : classes.connectedStatus
                : classes.unconnectedStatus
            }>
            <div>
              {data.connectedStatus
                ? data.isVip
                  ? 'Khách Hàng Vip'
                  : 'Đã Liên Kết'
                : 'Đã Yêu Cầu'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Ngày Liên Kết',
      field: 'connectedDate',
      render: (data) => {
        return <div>{data.connectedDate}</div>;
      },
    },
    {
      title: 'Hành Động',
      field: 'actions',
      render: (data) => {
        return (
          <ClickAwayListener
            onClickAway={() => {
              setIsOpenAction('');
            }}>
            <div
              onClick={() => {
                handleClickActions(data.id);
              }}>
              <IconButton aria-label='open'>
                <MoreHorizIcon color='primary' />
              </IconButton>
              <Zoom in={isOpenAction === data.id}>
                <div style={{ position: 'relative' }}>{getActions(data)}</div>
              </Zoom>
            </div>
          </ClickAwayListener>
        );
      },
    },
  ];

  return (
    <div>
      <Box className={classes.root}>
        <Typography variant='h6'>
          <Box p={2} fontWeight='bold' component='div'>
            Khách hàng đã liên kết
          </Box>
        </Typography>
        {isLoading ? (
          <Loading />
        ) : (
          <MaterialTable
            columns={columns}
            data={connectedSiteList}
            totalCount={siteItems.total}
            options={options}
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
        )}
      </Box>
    </div>
  );
}
