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
import MaterialTable, { MTableToolbar } from 'material-table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosService from '../../../config/axiosService';
import { ENV_ASSETS_ENDPOINT, ENV_GERMANY_ENDPOINT } from '../../../env/local';
import { useParams } from 'react-router';
import Loading from 'components/Layout/Loading';

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
      width: '100px',
      width: '100px',
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
  const { subCategoryFilter } = props;
  useEffect(() => {
    getSitesList();
  }, [isUpdated, subCategoryFilter]);
  const [isOpenAction, setIsOpenAction] = useState('');
  const classes = useStyle();
  const [siteItems, setSiteItems] = useState({
    total: 0,
    currentPage: 1,
    limit: 9999,
  });

  const params = useParams();

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

  const getSitesList = () => {
    axiosService
      .get('/connect', {
        page: siteItems.currentPage,
        limit: siteItems.limit,
        sub_category: subCategoryFilter,
      })
      .then((res) => {
        const data = res.data.connected_site;
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
        let sites = [];
        data.map((site) => {
          const siteInfo = site.accept_site;
          if (siteInfo) {
            sites.push({
              id: siteInfo._id,
              logo: siteInfo.avatar,
              name: siteInfo.name,
              connectedStatus: site.status === 'accepted',
              connectedDate: moment(site.updated_at).format('DD/MM/YYYY'),
              isVip: site.is_vip,
              userId: siteInfo.user_id,
            });
          }
        });

        if (params?.id) {
          const findItem = sites.find((item) => item.userId === params.id);
          if (findItem) {
            setOptions((value) => {
              return { ...value, searchText: findItem.name };
            });
          }
        }

        setConnectedSiteList(sites);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleViewSiteOnClick = (siteId) => {
    window.open(`${ENV_GERMANY_ENDPOINT}site/${siteId}`);
  };
  const handleChangePage = (page) => {
    setStateAndRerender(() =>
      setSiteItems({ ...siteItems, currentPage: page })
    );
  };
  const handleUnlinkOnClick = (siteId, siteName) => {
    axiosService.get('/my-site').then((res) => {
      const data = res.data;
      axiosService
        .delete(
          '/connect',
          {
            request_id: data.site._id,
            accept_site_id: siteId,
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

  const setStateAndRerender = (stateChange) => {
    stateChange();
    setIsUpdated(!isUpdated);
  };
  const handleClickActions = (itemId) => {
    setIsOpenAction(itemId);
  };
  const handleRejectConnection = (siteId, siteName) => {
    axiosService.get('/my-site').then((res) => {
      const data = res?.data?.site;
      axiosService
        .delete(
          '/connect',
          { request_id: data._id, accept_site_id: siteId },
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

  const getActions = (data) => {
    return data.connectedStatus ? (
      <div className={classes.actions}>
        <Button
          color='primary'
          className={clsx(classes.button, classes.viewSiteButton)}
          onClick={() => {
            handleViewSiteOnClick(data.id);
          }}>
          Xem site
        </Button>
        <Button
          color='primary'
          className={clsx(classes.button, classes.unlinkButton)}
          onClick={() => {
            handleUnlinkOnClick(data.id, data.name);
          }}>
          Hủy liên kết
        </Button>
      </div>
    ) : (
      <div className={classes.actions}>
        <Button
          color='primary'
          className={clsx(classes.button, classes.unlinkButton)}
          onClick={() => {
            handleRejectConnection(data.id, data.name);
          }}>
          Từ chối
        </Button>
      </div>
    );
  };
  const columns = [
    {
      title: 'Ảnh Đại Diện',
      field: 'logo',
      render: (data) => {
        return (
          <Box className={classes.logo}>
            <img src={`${ENV_ASSETS_ENDPOINT}${data.logo}`} />
          </Box>
        );
      },
    },
    {
      title: 'Tên Site',
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
              !data.isVip
                ? data.connectedStatus
                  ? classes.connectedStatus
                  : classes.unconnectedStatus
                : classes.vipStatus
            }>
            <div variant='body1'>
              {!data.isVip
                ? data.connectedStatus
                  ? 'Đã Liên Kết'
                  : 'Đã Yêu Cầu'
                : 'Khách Hàng Vip'}
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
            Công ty đã liên kết
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
