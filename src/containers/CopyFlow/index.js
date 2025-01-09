import { Box, Button, Paper } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import CommonModal from 'components/CommonModal';
import axiosService from 'config/axiosService';
import { COPYFLOW_VIEWTYPE } from 'constants/common';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import defaultImg from '../../assets/img/default_img.png';
import CopyFlowDiagramView from './DiagramView';
import CopyFlowListView from './ListView';
import SiteDetail from './SiteDetail';

const useStyles = makeStyles((theme) => ({
  root: {},
  hiddenFileInput: {
    width: 0,
    height: 0,
    position: 'relative',
    zIndex: 2,
    opacity: 0,
  },
  groupAction: {
    '& .MuiButton-label': {
      textTransform: 'uppercase',
      alignItems: 'center',
    },
  },
  button: {
    textTransform: 'none',
  },
}));
export default function CopyFlow() {
  const classes = useStyles();
  const [viewType, setViewType] = useState(COPYFLOW_VIEWTYPE.DIAGRAM);
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteItems, setSiteItems] = useState({
    total: 0,
    currentPage: 0,
    limit: 100,
  });
  const [connectedSiteList, setConnectedSiteList] = useState([]);
  const fetchCopyFlow = () => {
    const queryOption =
      viewType === COPYFLOW_VIEWTYPE.DIAGRAM
        ? {
            view_type: 'chart',
          }
        : {
            view_type: 'list',
            offset: siteItems.currentPage,
            limit: siteItems.limit,
          };
    axiosService
      .get(
        '/product-distribution',
        {
          ...queryOption,
        },
        {}
      )
      .then((res) => {
        const data = res.data;
        const sites = data.productDistribution;
        if (viewType === COPYFLOW_VIEWTYPE.LIST) {
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
            count,
          });
        }

        let items = [];
        sites.map((siteInfo) => {
          if (siteInfo && siteInfo?.site) {
            items.push({
              id: siteInfo?.site?._id,
              logo: siteInfo?.site?.avatar || defaultImg,
              name: siteInfo?.site?.name || '',
              connectedDate: siteInfo?.connected_at
                ? moment(siteInfo?.connected_at).format('DD/MM/YYYY')
                : '',
              origin: siteInfo.imported_site?.name || 'Không rõ',
              totalCopiedProducts: siteInfo?.total_copied_products || 0,
              imported_site_list: siteInfo?.imported_site_list || [],
              imported_site: siteInfo.imported_site,
              isVip: siteInfo?.is_vip,
              copied_products: siteInfo?.copied_products,
              copied_products_raw: siteInfo?.copied_products_raw || [],
              product_images: siteInfo?.product_images,
              children: [],
            });
          }
        });

        setConnectedSiteList(items);
      });
  };

  const handleUnlinkOnClick = (siteId, siteName) => {
    axiosService.get('/my-site').then((res) => {
      const data = res.data;
      axiosService
        .delete(
          '/connect',
          {
            request_id: siteId,
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
        });
    });
  };

  const openDetail = (selected) => {
    setSelectedSite(selected);
  };

  useEffect(() => {
    // getSitesList();
    fetchCopyFlow();
  }, [viewType]);

  return (
    <Box mt={4} className={classes.root}>
      <Box>
        <Box
          mb={3}
          display='flex'
          justifyContent='flex-end'
          alignItems='center'
          className={classes.groupAction}>
          <Box fontWeight='fontWeightBold' mr={2}>
            Hình thức biểu diễn :
          </Box>
          <Button
            variant={`${
              viewType === COPYFLOW_VIEWTYPE.LIST ? 'contained' : 'outlined'
            }`}
            color='primary'
            className={classes.button}
            style={{}}
            startIcon={<FormatListBulletedIcon />}
            onClick={() => {
              setViewType(COPYFLOW_VIEWTYPE.LIST);
            }}>
            Bảng
          </Button>
          <Box ml={1}>
            <Button
              variant={`${
                viewType === COPYFLOW_VIEWTYPE.DIAGRAM ? 'contained' : 'outlined'
              }`}
              color='primary'
              className={classes.button}
              onClick={() => {
                setViewType(COPYFLOW_VIEWTYPE.DIAGRAM);
              }}
              startIcon={<AccountTreeIcon />}>
              Sơ đồ
            </Button>
          </Box>
        </Box>
      </Box>
      <Box component={Paper}>
        {viewType === COPYFLOW_VIEWTYPE.DIAGRAM ? (
          <CopyFlowDiagramView
            openDetail={openDetail}
            connectedSiteList={connectedSiteList}
          />
        ) : (
          <CopyFlowListView
            openDetail={openDetail}
            handleUnlinkOnClick={handleUnlinkOnClick}
            connectedSiteList={connectedSiteList}
          />
        )}
      </Box>
      <CommonModal
        isOpen={selectedSite}
        handleClose={() => {
          setSelectedSite(null);
        }}
        maxWidth='lg'>
        {selectedSite && (
          <SiteDetail
            selectedSite={selectedSite}
            handleUnlinkOnClick={handleUnlinkOnClick}
          />
        )}
      </CommonModal>
    </Box>
  );
}
