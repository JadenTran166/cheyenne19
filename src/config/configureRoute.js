import CopyFlow from 'containers/CopyFlow';
import SaleNoteCtn from 'containers/SaleNoteCtn';
import ManageTracking from 'containers/ManageTracking';
import { lazy } from 'react';
import { convertArrayToObject } from '../utils';
import ManageTrackingList from 'containers/ManageTrackingList';
import ManageMyOrder from 'containers/ManageMyOrder';

// const LoginAdmin = lazy(() => import("../components/LoginAdmin/LoginAdmin"));

// const Login = lazy(() => import("../containers/Login"));
const CopyProduct = lazy(() => import('../containers/CopyProduct'));
const HomeCtn = lazy(() => import('../containers/HomeCtn'));
const ConnectedManagementCtn = lazy(() =>
  import('../containers/ConnectedManagementCtn/ConnectedManagementCtn')
);
const PortalCtn = lazy(() => import('../containers/PortalCtn/PortalCtn'));
const Dashboard = lazy(() => import('../containers/Dashboard/Dashboard'));
const ConfigTheme = lazy(() => import('../containers/ConfigTheme'));
const ComingSoon = lazy(() => import('../components/ComingSoon'));
const IngredientList = lazy(() => import('../containers/Ingredient'));
const CreateProduct = lazy(() => import('../containers/newCreateProduct'));
const ManageProduct = lazy(() => import('../containers/ManageProduct'));
const SettingsCtn = lazy(() => import('../containers/Settings'));
const PromoCtn = lazy(() => import('../containers/Promo'));

const ConnectedIngredientMgmtCtn = lazy(() =>
  import(
    '../containers/ConnectedIngredientManagementCtn/ConnectedIngredientManagementCtn'
  )
);
const ManageOrder = lazy(() => import('../containers/ManageOrder'));
const ManageEmployee = lazy(() => import('../containers/ManageEmployee'));

const listRoute = [
  {
    key: 'home',
    name: 'Trang chủ',
    path: '/',
    exact: true,
    component: Dashboard,
    auth: true,
    maxWidth: 'xl',
    disableGutters: true,
  },
  {
    key: 'manage_site',
    name: 'Trang chủ',
    path: '/quan-ly-site',
    exact: true,
    component: PortalCtn,
    auth: true,
    maxWidth: 'xl',
    disableGutters: true,
  },
  {
    key: 'dashboard',
    name: 'Thống kê',
    path: '/thong-ke',
    exact: true,
    component: Dashboard,
    auth: true,
    maxWidth: 'xl',
    disableGutters: true,
  },
  {
    key: 'login',
    name: 'login',
    path: '/dang-nhap',
    exact: true,
    component: HomeCtn,
  },
  {
    key: 'config_theme',
    name: 'Cài đặt',
    path: '/cai-dat-mau-trang-web',
    exact: true,
    component: ConfigTheme,
    auth: true,
    owner: true,
  },
  {
    key: 'ingredient_list',
    name: 'Nguyên liệu',
    path: '/danh-sach-nguyen-lieu',
    exact: true,
    component: IngredientList,
    auth: true,
  },
  {
    key: 'create_product',
    name: 'Tạo sản phẩm',
    path: '/tao-san-pham',
    exact: true,
    component: CreateProduct,
    auth: true,
  },
  {
    key: 'copy_product',
    name: 'Copy sản phẩm',
    path: '/copy-san-pham',
    exact: true,
    component: CopyProduct,
    auth: true,
  },
  {
    key: 'manage_product',
    name: 'Sản phẩm',
    path: '/quan-ly-san-pham',
    exact: true,
    component: ManageProduct,
    auth: true,
    maxWidth: 'xl',
  },
  {
    key: 'manage_connected_site',
    name: 'Quản lý trang liên kết',
    path: '/quan-ly-trang-lien-ket',
    exact: false,
    component: ConnectedManagementCtn,
    auth: true,
  },
  {
    key: 'manage_connected_ingredient',
    name: 'Quản lý nguyên liệu liên kết',
    path: '/quan-ly-nguyen-lieu-lien-ket',
    exact: true,
    component: ConnectedIngredientMgmtCtn,
    auth: true,
  },
  {
    key: 'customer_order',
    name: 'Đơn hàng',
    path: ['/quan-ly-don-hang', '/quan-ly-don-hang/:id'],
    pathDynamic: '/quan-ly-don-hang',
    exact: true,
    component: ManageOrder,
    auth: true,
  },
  // {
  //   key: 'customer_order_detail',
  //   name: 'Đơn hàng',
  //   path: '/quan-ly-don-hang/:id',
  //   pathDynamic: '/quan-ly-don-hang/:id',
  //   exact: true,d
  //   component: ManageOrder,
  //   auth: true,
  // },
  {
    key: 'my_order',
    name: 'Đơn mua',
    path: ['/don-hang', '/don-hang/:id'],
    pathDynamic: '/don-hang',
    exact: true,
    component: ManageMyOrder,
    auth: true,
  },
  // {
  //   key: 'my_order_detail',
  //   name: 'Đơn mua',
  //   path: ['/don-hang', '/don-hang/:id'],
  //   pathDynamic: '/don-hang',
  //   exact: true,
  //   component: ManageMyOrder,
  //   auth: true,
  // },
  {
    key: 'settings',
    name: 'Cài đặt',
    path: '/cai-dat',
    exact: true,
    component: SettingsCtn,
    auth: true,
    owner: true,
  },
  {
    key: 'promo',
    name: 'Khuyến mãi',
    path: '/tao-khuyen-mai',
    exact: true,
    component: PromoCtn,
    auth: true,
  },
  {
    key: 'copy_flow',
    path: '/day-chuyen-copy',
    exact: true,
    component: CopyFlow,
    auth: true,
    wholeSaleOnly: true,
  },
  {
    key: 'employee',
    name: 'Nhân viên',
    path: ['/quan-ly-nhan-vien', '/quan-ly-nhan-vien/:id'],
    pathDynamic: '/quan-ly-nhan-vien/[id]',
    exact: true,
    component: ManageEmployee,
    auth: true,
    manager: true,
  },
  {
    key: 'sale_note',
    name: 'Giấy ghi nhớ',
    path: '/note',
    exact: true,
    component: SaleNoteCtn,
    auth: true,
    maxWidth: 'xl',
  },
  {
    key: 'tracking',
    name: 'Nhật ký hoạt động',
    path: '/nhat-ky-hoat-dong',
    exact: true,
    component: ManageTracking,
    auth: true,
  },
  {
    key: 'tracking_list',
    name: 'Nhật ký hoạt động',
    path: '/danh-sach-nhat-ky-hoat-dong',
    exact: true,
    component: ManageTrackingList,
    auth: true,
  },

  // {
  //   key: 'settings',
  //   path: '/settings',
  //   exact: true,
  //   component: ComingSoon,
  //   auth: true,
  // },
];

export const listRouteByKey = convertArrayToObject(listRoute, 'key');

export default listRoute;
