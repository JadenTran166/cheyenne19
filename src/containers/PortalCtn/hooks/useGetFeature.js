// import useRole from '../../../hooks/useRole';
import axiosService from 'config/axiosService';
import { USER_ROLE, USER_TYPE } from 'constants/common';
import { ENV_GERMANY_ENDPOINT } from 'env/local';
import useUserData from 'hooks/useUserData';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from 'slice/userSlice';
import { listRouteByKey } from '../../../config/configureRoute';

const publicFeatures = [
  {
    key: 'about_cheyenne',
    name: 'Về - Cheyenne 19',
    iconNew: 'C19',
    link: '#',
    // isSpecial: true,
  },
  {
    key: 'my_site',
    name: 'Xem trang của bạn',
    link: '#',
    iconNew: 'User',
  },
  {
    key: 'customer_order',
    name: 'Đơn hàng',
    link: listRouteByKey['customer_order'].pathDynamic,
    iconNew: 'Order',
  },
  {
    key: 'my_order',
    name: 'Đơn mua',
    link: listRouteByKey['my_order'].pathDynamic,
    iconNew: 'MyOrder',
  },
  {
    key: 'connected_site',
    name: 'Quản lý liên kết',
    link: listRouteByKey['manage_connected_site'].path,
    iconNew: 'ConnectSite',
  },
  {
    key: 'find',
    name: 'Tìm nguồn hàng',
    link: '/find',
    iconNew: 'FindStore',
  },
  // {
  //   key: 'manage_ingredients',
  //   name: 'Kho nguyên liệu',
  //   link: listRouteByKey['ingredient_list'].path,
  //   iconNew: 'Ingredients',
  // },
  {
    key: 'manage_product',
    name: 'Kho sản phẩm',
    link: listRouteByKey['manage_product'].path,
    iconNew: 'Warehouse',
  },
  {
    key: 'create_product',
    name: 'Tạo sản phẩm',
    link: listRouteByKey['create_product'].path,
    iconNew: 'CreateProduct',
  },
  {
    key: 'copy_product',
    name: 'Copy sản phẩm',
    link: listRouteByKey['copy_product'].path,
    iconNew: 'CopyProduct',
  },
  {
    key: 'settings',
    name: 'Cài đặt',
    link: listRouteByKey['settings'].path,
    iconNew: 'Setting',
    role: USER_ROLE.OWNER,
  },
  {
    key: 'promo',
    name: 'Khuyến mãi',
    link: listRouteByKey['promo'].path,
    iconNew: 'Promo',
  },
  {
    key: 'copy_flow',
    name: 'Dây Chuyền phần phối',
    link: listRouteByKey['copy_flow'].path,
    iconNew: 'CopyFlow',
    seller_type: USER_TYPE.WHOLE_SALE,
  },
  {
    key: 'employee',
    name: 'Quản lý nhân viên',
    link: listRouteByKey['employee'].path[0],
    iconNew: 'ManageEmployee',
    role: [USER_ROLE.OWNER, USER_ROLE.MANAGER],
  },
  {
    key: 'tracking_list',
    name: 'Nhật ký hoạt động',
    link: listRouteByKey['tracking_list'].path,
    iconNew: 'ManageTracking',
  },
  {
    key: 'sale_note',
    name: 'Giấy ghi nhớ',
    link: listRouteByKey['sale_note'].path,
    iconNew: 'Note',
  },
  {
    key: 'statistic',
    name: 'Thống kê',
    link: listRouteByKey['dashboard'].path,
    iconNew: 'Dashboard',
  },
];

// function filterComingSoon(item) {
//   // return item.link !== '/coming_soon';
//   return item;
// }

export default function useGetFeature(small = false) {
  const history = useHistory();
  const { userData } = useUserData();
  const dispatch = useDispatch();
  let routes = [];
  publicFeatures.forEach((item) => {
    if (item.key === 'about_cheyenne') {
      item.onClick = function () {
        window.location.href = ENV_GERMANY_ENDPOINT;
      };
    }
    if (item.key === 'my_site') {
      item.onClick = function () {
        window.open(
          `${ENV_GERMANY_ENDPOINT}site/${userData?.site?.id}`,
          '_blank'
        );
      };
    }
    if (item.key === 'find') {
      item.onClick = function () {
        axiosService
          .post('/users/otp-generate')
          .then((res) => {
            const { otp } = res.data;
            const link = `${ENV_GERMANY_ENDPOINT}explore/sites?filter=wholesale&otp=${otp.key}&id=${userData?._id}`;
            window.open(link);
          })
          .catch((err) => {
            alert(err);
            console.error(err);
          });
      };
    }
    routes.push({ ...item });
  });
  routes.push({
    key: 'logout',
    name: 'Đăng xuất',
    link: '#',
    iconNew: 'Power',
    onClick: async function () {
      await dispatch(logout());
      history.push(listRouteByKey['login'].path);
    },
  });

  const roleBaseRoutes = routes.filter(
    (item) =>
      (!item.role || (item?.role && item?.role.includes(userData.role))) &&
      (!item?.seller_type ||
        (item?.seller_type && item?.seller_type === userData?.seller_type))
  );

  if (small) {
    roleBaseRoutes.push({
      key: 'portal',
      name: 'Trang cá nhân',
      link: listRouteByKey['manage_site'].path,
      iconNew: 'Widgets',
    });

    const listHidden = ['logout', 'about_cheyenne', 'find'];

    return roleBaseRoutes.filter((route) => !listHidden.includes(route.key));
  }

  return [...roleBaseRoutes];
}
