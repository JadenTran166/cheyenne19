import { Box, CircularProgress, SvgIcon } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ReactComponent as Connect } from '../../assets/icon/connect.svg';
import { ReactComponent as Deal } from '../../assets/icon/deal.svg';
import { ReactComponent as Ingredients } from '../../assets/icon/ingredients.svg';
import { ReactComponent as Order } from '../../assets/icon/order.svg';
import { ReactComponent as Upgrade } from '../../assets/icon/upgrade.svg';
import axiosService from '../../config/axiosService';
import socketService from '../../config/socketService';
import {
  checkToday,
  formatDateTime,
  formatRelativeTime,
  NOTIFICATION_SCOPES,
  NOTIFICATION_TYPES,
} from '../../constants/common';
import { ENV_GERMANY_ENDPOINT } from '../../env/local';
import { getCookie } from '../../utils/index';
import cn from 'classnames';
import Grow from '@material-ui/core/Grow';
import { handleOtpNavigate } from '../../utils';
import useUserData from '../../hooks/useUserData';
const {
  DEAL,
  CONNECT,
  INGREDIENTS,
  ORDER,
  UPGRADE,
  PROMOTIONS,
  SALE_NOTES,
  PRODUCTS,
} = NOTIFICATION_TYPES;
const { SITE, USER } = NOTIFICATION_SCOPES;

const useStyles = makeStyles((theme) => ({
  ctn: {
    position: 'relative',
  },
  isNotOpen: {
    display: 'none',
  },
  notificationContainer: {
    position: 'absolute',
    borderRadius: '10px',
    zIndex: 9999,
    top: '3rem',
    // right: '6.5rem',
    right: '0',

    [theme.breakpoints.down(1440)]: {
      // right: '4rem',
      top: '3.4rem',
    },
    width: '400px',
    fontWeight: 300,
    background: '#ffffff',
    boxSizing: 'border-box',
    boxShadow: '0.5rem 0.5rem 2rem 0 rgba(0, 0, 0, 0.2)',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    '&::before': {
      content: "' '",
      position: 'absolute',
      top: '1px',
      right: '-10.5rem',
      width: 0,
      height: 0,
      transform: 'translate(-11.25rem, -100%)',
      borderLeft: '0.75rem solid transparent',
      borderRight: '0.75rem solid transparent',
      borderBottom: '0.75rem solid white',
    },
  },
  notiItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    color: '#000',
    // borderBottom: '1px solid #707070',
    cursor: 'pointer',
    transition: '0.2s background-color',
    position: 'relative',
    '&:hover': {
      backgroundColor: '#d7e2f4',
    },
  },
  icon: {
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  svgIcon: {
    width: '30px',
    height: '30px',
    fill: theme.palette.primary.main,
  },
  content: {
    marginLeft: 10,
    // minWidth: '72%',
    paddingRight: '10px',
  },
  notiList: {
    margin: 0,
    padding: 0,
    maxHeight: 450,
    minHeight: 410,
    overflowY: 'auto',
  },
  hiddenScroll: {
    // overflowY: 'hidden',
    // maxHeight: 375,
    minHeight: 375,
  },
  bold: {
    color: '#EF7F00',
    fontWeight: 600,
  },
  contentDetail: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: '20px',
    '& b': {
      color: theme.palette.primary.main,
      fontWeight: 700,
      fontSize: 18,
      fontFamily: 'inherit',
    },
    textAlign: 'left',
  },
  time: {
    marginTop: 6,
    fontSize: 10,
  },
  title: {
    fontSize: '20px',
    lineHeight: '27px',
    color: theme.palette.primary.main,
    margin: '12px',
    fontWeight: 700,
    textAlign: 'left',
  },
  loadMore: {
    padding: '6px',
    fontSize: '14px',
    textAlign: 'center',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: '#F3F3F3',
    },
    cursor: 'pointer',
  },
  loadMoreText: {
    color: theme.palette.primary.main,
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
  },
  readStatus: {
    minWidth: 10,
    minHeight: 10,
    background: theme.palette.primary.main,
    borderRadius: '50%',
    position: 'absolute',
    top: '45%',
    right: '10px',
  },
}));

export default function Notification(props) {
  const classes = useStyles();
  const history = useHistory();
  const { userData } = useUserData();
  const [loading, setLoading] = useState(true);
  const [notificationList, setNotificationList] = useState([]);
  const [unreadNotificationQuantities, setUnreadNotificationQuantities] =
    useState(0);
  const [isUpdated, setIsUpdated] = useState(false);
  const [siteItems, setSiteItems] = useState({
    total: 0,
    page: 1,
    limit: 100,
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // useEffect(() => {
  //   countUnreadNotification();
  // }, [isUpdated]);
  const countUnreadNotification = () => {
    axiosService.get('/notifications/stat').then((res) => {
      if (res && res.data) {
        setUnreadNotificationQuantities(res.data.data.unread);
      }
    });
  };
  useEffect(() => {
    if (!userData?._id) return;

    getNotificationList();

    socketService.listenEvent('NEW_NOTI', (data) => {
      if (data?.data) {
        setNotificationList((oldValue) => {
          return [{ ...data.data }, ...oldValue];
        });
      }
      countUnreadNotification();
      Swal.fire({
        text: 'Bạn có thông báo mới',
        icon: 'success',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000,
      });
      // }
      // }
    });
  }, [userData?._id]);

  const renderIcon = (type) => {
    switch (type) {
      case 'deal':
        return <Deal />;
      case 'order':
        return <Order />;
      case 'connect':
        return <Connect />;
      case 'upgrade':
        return <Upgrade />;
      case 'memo-paper':
        return <Order />;
      default:
        return <Ingredients />;
    }
  };

  const getNotificationList = () => {
    const token = getCookie('germany_admin_token');
    if (token) {
      axiosService.setToken(token);
      axiosService
        .get('/notifications', { page: siteItems.page, limit: siteItems.limit })
        .then((res) => {
          const notifications = res.data.data;
          const paging = res.data.paging;
          setNotificationList(notifications);
          setSiteItems(paging);
          setLoading(false);
        });
    }
  };
  const generateTitle = (value) => {
    const { reference, key_word, data, is_read, messageQuantities, title } =
      value;
    let order;
    if (data && data.order) {
      order = data.order;
    }
    const formatId = data?.order?._id?.slice(-6) || '---';
    const refSiteName = reference?.name;
    const ref_name = reference?.name || '';
    switch (key_word) {
      case DEAL.NEW_MESSAGE:
        return (
          <Typography className={classes.contentDetail}>
            Bạn có <b>${messageQuantities || 1}</b> tin nhắn mới
          </Typography>
        );
      case DEAL.NEW_OFFER:
        return (
          <Typography className={classes.contentDetail}>
            Bạn nhận được 1 đề nghị từ <b>{ref_name}</b>
          </Typography>
        );
      case DEAL.REFUSED:
        return (
          <Typography className={classes.contentDetail}>
            Deal <b>{order._id}</b> của bạn đã bị từ chối bởi <b>{ref_name}</b>
          </Typography>
        );
      case DEAL.ACCEPTED:
        return (
          <Typography className={classes.contentDetail}>
            Deal {order._id} của bạn đã được <b>{ref_name}</b> chấp thuận
          </Typography>
        );
      case ORDER.CONFIRMED:
        return (
          <Typography className={classes.contentDetail}>
            Đơn hàng <b>{formatId}</b> của bạn đã được xác nhận
          </Typography>
        );
      case ORDER.CANCELLED:
        return (
          <Typography className={classes.contentDetail}>
            Đơn hàng <b>{formatId}</b> của bạn đã bị hủy
          </Typography>
        );
      case ORDER.SHIPPING:
        return (
          <Typography className={classes.contentDetail}>
            Đơn hàng <b>{formatId}</b> của bạn đang được giao
          </Typography>
        );
      case ORDER.NEW:
        return (
          <Typography className={classes.contentDetail}>
            Bạn nhận được 1 đơn hàng mới <b>{formatId}</b>
          </Typography>
        );
      case ORDER.RECEIVED:
        return (
          <Typography className={classes.contentDetail}>
            Khách đã nhận được hàng từ đơn hàng <b>{formatId}</b>{' '}
          </Typography>
        );
      case ORDER.PACKAGED:
        return (
          <Typography className={classes.contentDetail}>
            Đơn hàng <b>{formatId}</b> của bạn đã được xác nhận và đang soạn kho{' '}
          </Typography>
        );
      case CONNECT.NEW_RETAIL:
        return (
          <Typography className={classes.contentDetail}>
            Bạn nhận được 1 yêu cầu liên kết từ <b>{ref_name}</b>
          </Typography>
        );
      case CONNECT.NEW_WHOLESALE:
        return (
          <Typography className={classes.contentDetail}>
            Bạn nhận được 1 yêu cầu liên kết từ <b>{refSiteName}</b>
          </Typography>
        );
      case CONNECT.ACCEPTED_RETAIL:
        return (
          <Typography className={classes.contentDetail}>
            Yêu cầu liên kết của bạn với <b>{ref_name}</b> đã được chấp nhận
          </Typography>
        );
      case CONNECT.ACCEPTED_WHOLESALE:
        return (
          <Typography className={classes.contentDetail}>
            Yêu cầu liên kết của bạn với <b>{ref_name}</b> đã được chấp nhận
          </Typography>
        );
      case CONNECT.REFUSE_RETAIL:
        return (
          <Typography className={classes.contentDetail}>
            Yêu cầu liên kết của bạn với <b>{ref_name}</b> đã bị từ chối
          </Typography>
        );
      case CONNECT.CANCEL_RETAIL:
        return (
          <Typography className={classes.contentDetail}>
            Liên kết giữa bạn và <b>{ref_name}</b> đã bị hủy bỏ
          </Typography>
        );
      case CONNECT.REFUSE_WHOLESALE:
        return (
          <Typography className={classes.contentDetail}>
            Yêu cầu liên kết của bạn với <b>{ref_name}</b> đã bị từ chối
          </Typography>
        );
      case CONNECT.VIP:
        return (
          <Typography className={classes.contentDetail}>
            Bạn đã trở thành khách VIP của site <b>{ref_name}</b>
          </Typography>
        );
      case UPGRADE.HIGH_LEVEL_SUCCESS:
        return (
          <Typography className={classes.contentDetail}>
            Yêu cầu xác thực của bạn đã được duyệt
          </Typography>
        );
      case UPGRADE.HIGH_LEVEL_FAIL:
        return (
          <Typography className={classes.contentDetail}>
            Yêu cầu xác thực của bạn đã bị từ chối
          </Typography>
        );
      case UPGRADE.HIGH_LEVEL_CANCELLED:
        return (
          <Typography className={classes.contentDetail}>
            Liên kết giữa bạn và <b>{ref_name}</b> đã bị hủy bỏ
          </Typography>
        );
      case INGREDIENTS.NEW_REQUEST:
        return (
          <Typography className={classes.contentDetail}>
            Bạn nhận được một yêu cầu xác thực nguyên liệu từ <b>{ref_name}</b>
          </Typography>
        );
      case INGREDIENTS.REQUEST_ACCEPTED:
        return (
          <Typography className={classes.contentDetail}>
            Yêu cầu xác thực nguyên liệu của bạn đã được <b>{ref_name}</b> chấp
            thuận
          </Typography>
        );
      case INGREDIENTS.REQUEST_REFUSED:
        return (
          <Typography className={classes.contentDetail}>
            Yêu cầu xác thực nguyên liệu của bạn đã bị <b>{ref_name}</b> từ chối
          </Typography>
        );
      case INGREDIENTS.REQUEST_CANCELLED:
        return (
          <Typography className={classes.contentDetail}>
            Liên kết nguyên liệu của bạn với <b>{ref_name}</b> đã bị hủy
          </Typography>
        );
      case PROMOTIONS.DIRECT:
        return (
          <Typography className={classes.contentDetail}>
            Công ty <b>${ref_name}</b> có chương trình khuyến mãi{' '}
            {data.product.price.discount}% cho Sản phẩm {data.product.name}
          </Typography>
        );
      case PROMOTIONS.CONTENT:
        return (
          <Typography>
            Công ty <b>${ref_name}</b> hiện tại đang có chương trình khuyến mãi{' '}
            <b>{data.promotion.title}</b>
          </Typography>
        );
      case SALE_NOTES.NEW_SHARED:
        return (
          <Typography className={classes.contentDetail}>{title}</Typography>
        );
      case PRODUCTS.NEW:
        return (
          <Typography className={classes.contentDetail}>
            <b>{ref_name}</b> vừa thêm sản phẩm mới <b>{data.product.name}</b>
          </Typography>
        );
      case PRODUCTS.DELETE:
        return (
          <Typography className={classes.contentDetail}>
            <b>{data.site.name}</b> vừa xóa sản phẩm <b>{data.product.name}</b>,
            sản phẩm sẽ bị xóa khỏi kho hàng và các đơn hàng liên quan sẽ không
            thể tiếp tục.
          </Typography>
        );
      default:
        return '';
    }
  };
  const markNotificationAsRead = (notificationId) => {
    axiosService.get(`/notifications/${notificationId}`).then(() => {
      countUnreadNotification();

      setNotificationList((oldData) =>
        oldData.map((item) => {
          if (item.id === notificationId) {
            item.is_read = true;
          }
          return item;
        })
      );
    });
  };

  const markReadAll = async () => {
    axiosService.post(`notifications/mark-read`).then(() => {
      countUnreadNotification();
    });
  };
  const handleOnClickNotification = (value) => {
    const { key_word, data, reference, user_id } = value;
    const orderId = data?.order?._id;
    const refSiteId = reference?._id;
    const scope = value.scope;
    const refSiteName = reference?.name;
    markNotificationAsRead(value._id);
    setIsNotificationOpen(!isNotificationOpen);
    if (scope === SITE) {
      switch (key_word) {
        case DEAL.NEW_MESSAGE:
          return;
        case DEAL.NEW_OFFER:
          return;
        case DEAL.REFUSED:
          return;
        case DEAL.ACCEPTED:
          return;
        case ORDER.CONFIRMED:
        case ORDER.CANCELLED:
        case ORDER.SHIPPING:
        case ORDER.PACKAGED:
          if (
            data.order.user === userData._id ||
            (userData.is_employee && data.order.user === userData.site.user_id)
          ) {
            return history.push(`/don-hang/${orderId}`);
          }
          return history.push(`/quan-ly-don-hang/${orderId}`);
        case ORDER.RECEIVED:
        case ORDER.NEW:
          return history.push(`/quan-ly-don-hang/${orderId}`);
        case CONNECT.REFUSE_WHOLESALE:
        case CONNECT.ACCEPTED_WHOLESALE:
        case CONNECT.NEW_WHOLESALE:
          if (userData.site.id.toString() === data.ConnectedSite.accept_site) {
            return history.push('/quan-ly-trang-lien-ket/customer');
          }
          return history.push('/quan-ly-trang-lien-ket');
        case CONNECT.CANCEL_RETAIL:
        case CONNECT.ACCEPTED_RETAIL:
        case CONNECT.NEW_RETAIL:
        case CONNECT.REFUSE_RETAIL:
          if (userData.site.id.toString() === data.ConnectedUser.site) {
            return history.push('/quan-ly-trang-lien-ket/customer');
          }
          return history.push('/quan-ly-trang-lien-ket');
        case CONNECT.VIP:
          return handleOtpNavigate(userData._id, `site/${refSiteId}`);
        case UPGRADE.HIGH_LEVEL_SUCCESS:
          return;
        case UPGRADE.HIGH_LEVEL_FAIL:
          return;
        case UPGRADE.HIGH_LEVEL_CANCELLED:
          return;
        case INGREDIENTS.NEW_REQUEST:
          return history.push('/quan-ly-nguyen-lieu-lien-ket');
        case INGREDIENTS.REQUEST_ACCEPTED:
        case INGREDIENTS.REQUEST_REFUSED:
        case INGREDIENTS.REQUEST_CANCELLED:
          return history.push('/danh-sach-nguyen-lieu');
        case PROMOTIONS.DIRECT:
          return handleOtpNavigate(
            userData._id,
            `product/${data.productInSites[0]}`
          );
        case PROMOTIONS.CONTENT:
          return handleOtpNavigate(
            userData._id,
            `site/${data.promotionSite._id}/promotion/${data.promotion.id}`
          );
        case SALE_NOTES.NEW_SHARED:
          return history.push('/note');
        case PRODUCTS.NEW:
          return history.push('/copy-san-pham');
        case PRODUCTS.DELETE:
          return history.push('/quan-ly-san-pham');
        default:
          return '';
      }
    } else {
      switch (key_word) {
        case DEAL.NEW_MESSAGE:
          return;
        case DEAL.NEW_OFFER:
          return;
        case DEAL.REFUSED:
          return;
        case DEAL.ACCEPTED:
          return;
        case ORDER.CONFIRMED:
        case ORDER.CANCELLED:
        case ORDER.SHIPPING:
        case ORDER.RECEIVED:
        case ORDER.PACKAGED:
          // return handleOtpNavigate(userData._id, `order/${orderId}`);
          return history.push(`/don-hang/${orderId}`);
        case ORDER.NEW:
          return handleOtpNavigate(userData._id, `order`);
        case CONNECT.ACCEPTED_WHOLESALE:
        case CONNECT.REFUSE_WHOLESALE:
        case CONNECT.CANCEL_WHOLESALE:
        case CONNECT.NEW_WHOLESALE:
          // User is the one who put action
          if (data.ConnectedSite.request === userData.site._id.toString()) {
            return history.push(`/quan-ly-trang-lien-ket`);
          }
          //User is the one who receive action
          if (data.ConnectedSite.accept_site === userData.site._id.toString()) {
            return history.push(`/quan-ly-trang-lien-ket/customer`);
          }
          break;
        case CONNECT.CANCEL_RETAIL:
          // User is the one who cancel
          if (data.ConnectedUser.site === userData.site._id.toString()) {
            return history.push(`/quan-ly-trang-lien-ket`);
          }

          //User is the one who receive the cancel
          if (data.ConnectedUser.site !== userData.site._id.toString()) {
            return history.push(`/quan-ly-trang-lien-ket/customer`);
          }
          break;
        case CONNECT.ACCEPTED_RETAIL:
        case CONNECT.REFUSE_RETAIL:
        case CONNECT.VIP:
          // User is the one who put action
          if (data.ConnectedUser.site === userData.site._id.toString()) {
            return history.push(`/quan-ly-trang-lien-ket`);
          }

          //User is the one who receive action
          if (data.ConnectedUser.site !== userData.site._id.toString()) {
            return history.push(`/quan-ly-trang-lien-ket/customer`);
          }
          break;
        case CONNECT.NEW_RETAIL:
          console.log(data.ConnectedUser.site , userData.site._id.toString())
          // User is the one who put action
          if (data.ConnectedUser.site === userData.site._id.toString()) {
            return history.push(`/quan-ly-trang-lien-ket/customer`);

          }
          //User is the one who receive action
          if (data.ConnectedUser.site !== userData.site._id.toString()) {
            return history.push(`/quan-ly-trang-lien-ket`);
          }
          break;
        case UPGRADE.HIGH_LEVEL_SUCCESS:
          return;
        case UPGRADE.HIGH_LEVEL_FAIL:
          return;
        case UPGRADE.HIGH_LEVEL_CANCELLED:
          return;
        case INGREDIENTS.NEW_REQUEST:
          return history.push('/quan-ly-nguyen-lieu-lien-ket');
        case INGREDIENTS.REQUEST_ACCEPTED:
        case INGREDIENTS.REQUEST_REFUSED:
        case INGREDIENTS.REQUEST_CANCELLED:
          return history.push('/danh-sach-nguyen-lieu');
        case PROMOTIONS.DIRECT:
          return handleOtpNavigate(
            userData._id,
            `product/${data.productInSites[0]}`
          );
        case PROMOTIONS.CONTENT:
          return handleOtpNavigate(
            userData._id,
            `site/${data.promotionSite._id}/promotion/${data.promotion.id}`
          );
        default:
          return '';
      }
    }
  };

  const loadMoreNotifications = (event) => {
    event.stopPropagation();
    setLoading(true);
    setSiteItems({
      ...siteItems,
      page: siteItems.page + 1,
    });
    axiosService
      .get('/notifications', {
        page: siteItems.page + 1,
        limit: siteItems.limit,
      })
      .then((res) => {
        const notifications = res.data.data;
        const paging = res.data.paging;
        const newNotificationList = _.concat(notificationList, notifications);
        setNotificationList(newNotificationList);
        setSiteItems(paging);
        setLoading(false);
        const listNotiEl = document.getElementById('listNoti');
        if (listNotiEl) {
          listNotiEl.scrollTo({
            top: listNotiEl.scrollTop + 100,
            left: 0,
            behavior: 'smooth',
          });
        }
      });
  };
  const handleClickNotification = async () => {
    if (isNotificationOpen) {
      markReadAll();
    } else {
      // countUnreadNotification();
      // setIsUpdated(!isUpdated);
    }

    setIsNotificationOpen((value) => !value);

    setSiteItems({ ...siteItems, page: 1 });
  };

  function handleCloseNoti() {
    const listNotiEl = document.getElementById('listNoti');
    if (listNotiEl) {
      listNotiEl.scrollTop = 0;
    }
    setIsNotificationOpen(false);
  }

  useEffect(() => {
    countUnreadNotification();
  }, []);

  return (
    <ClickAwayListener onClickAway={handleCloseNoti}>
      <div className={classes.ctn}>
        <Tooltip title='Thông báo'>
          <IconButton
            color='inherit'
            onClick={async () => {
              await handleClickNotification();
            }}>
            <Badge
              badgeContent={unreadNotificationQuantities}
              color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Grow in={isNotificationOpen}>
          <div
            className={
              isNotificationOpen
                ? classes.notificationContainer
                : classes.isNotOpen
            }>
            <Typography className={classes.title}>Thông báo</Typography>
            <ul
              id='listNoti'
              className={cn({
                [classes.notiList]: true,
                [classes.hiddenScroll]: notificationList.length <= 5,
              })}>
              {notificationList?.length > 0 &&
                notificationList.map((value, index) => {
                  const day = value.created_at;
                  return (
                    <li
                      className={classes.notiItem}
                      key={index}
                      onClick={() => {
                        handleOnClickNotification(value);
                      }}>
                      <div className={classes.icon}>
                        <SvgIcon className={classes.svgIcon}>
                          {renderIcon(value.type)}
                        </SvgIcon>
                      </div>
                      <div className={classes.content}>
                        <Typography
                          className={classes.contentDetail}
                          component='div'>
                          {generateTitle(value)}
                        </Typography>
                        <Box
                          display='flex'
                          justifyContent='space-between'
                          alignItems='center'>
                          <span className={classes.time}>
                            {checkToday(day)
                              ? formatRelativeTime(day)
                              : formatDateTime(day)}
                          </span>
                        </Box>
                      </div>
                      {!value.is_read ? (
                        <div className={classes.readStatus} />
                      ) : (
                        ''
                      )}
                    </li>
                  );
                })}
              {loading ? (
                <Box display='flex' justifyContent='center' px={4} py={4}>
                  <CircularProgress color='secondary' />
                </Box>
              ) : notificationList.length ? null : (
                <Box display='flex' justifyContent='center' px={4} py={4}>
                  <Typography color='primary'>
                    Không có thông báo mới
                  </Typography>
                </Box>
              )}
            </ul>
            {notificationList?.length > 0 &&
              notificationList?.length < siteItems.total && (
                <div
                  className={classes.loadMore}
                  onClick={loadMoreNotifications}>
                  <Typography className={classes.loadMoreText}>
                    {loading ? (
                      <CircularProgress color='primary' size='20px' />
                    ) : (
                      'Xem thêm'
                    )}
                  </Typography>
                </div>
              )}
          </div>
        </Grow>
      </div>
    </ClickAwayListener>
  );
}
