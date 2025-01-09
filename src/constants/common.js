import { ENV_ASSETS_ENDPOINT } from 'env/local';
import * as moment from 'moment';
import 'moment/locale/vi';
export const USER_TYPE = {
  WHOLE_SALE: 'wholesale',
  RETAIL: 'retail',
};
export const ASSETS_ENDPOINT = ENV_ASSETS_ENDPOINT;
export const NOTIFICATION_TYPES = {
  DEAL: {
    NEW_MESSAGE: 'deal_new_message',
    NEW_OFFER: 'deal_new_offer',
    REFUSED: 'deal_refused',
    ACCEPTED: 'deal_accepted',
  },
  ORDER: {
    CONFIRMED: 'order_confirmed',
    CANCELLED: 'order_canceled',
    SHIPPING: 'order_shipping',
    NEW: 'order_new',
    RECEIVED: 'order_received',
    PACKAGED: 'order_packed',
  },
  CONNECT: {
    NEW_RETAIL: 'connect_new_retail',
    NEW_WHOLESALE: 'connect_new_wholesale',
    ACCEPTED_RETAIL: 'connect_accept_retail',
    ACCEPTED_WHOLESALE: 'connect_accept_wholesale',
    REFUSE_RETAIL: 'connect_refuse_retail',
    CANCEL_RETAIL: 'connect_cancel_retail',
    REFUSE_WHOLESALE: 'connect_refuse_wholesale',
    CANCEL_WHOLESALE: 'connect_cancel_wholesale',
    VIP: 'connect_vip',
  },
  UPGRADE: {
    HIGH_LEVEL_SUCCESS: 'upgrade_high_level_success',
    HIGH_LEVEL_FAIL: 'upgrade_high_level_fail',
    HIGH_LEVEL_CANCELLED: 'upgrade_high_level_canceled',
  },
  INGREDIENTS: {
    NEW_REQUEST: 'ingredients_new_request',
    REQUEST_ACCEPTED: 'ingredients_request_accepted',
    REQUEST_REFUSED: 'ingredients_request_refused',
    REQUEST_CANCELLED: 'ingredients_request_canceled',
  },
  PROMOTIONS: {
    DIRECT: 'promotion_direct',
    CONTENT: 'promotion_content',
  },
  SALE_NOTES: {
    NEW_SHARED: 'memo_shared',
  },
  PRODUCTS: {
    NEW: 'product_new',
    RESELLING: "product_reselling",
    SELLING: "product_selling",
    DELETE: "product_delete"
  }
};
export const NOTIFICATION_SCOPES = {
  SITE: 'site',
  USER: 'user',
};

export const editorConfiguration = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      'alignment',
      '|',
      'fontBackgroundColor',
      'fontColor',
      'fontSize',
      'fontFamily',
      'highlight',
      'removeFormat',
      '-',
      // 'imageInsert',
      'linkImage',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'horizontalLine',
      '|',
      'undo',
      'redo',
    ],
    shouldNotGroupWhenFull: true,
  },
  language: 'en',
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
  licenseKey: '',
};

export const currentDate = () => {
  return new Date();
};
export const FORMAT_DATETIME = 'DD/MM/YYYY HH:mm';

export const FORMAT_DATE = 'DD/MM/YYYY';

export const formatRelativeTime = (currentDate) => {
  return currentDate ? moment(currentDate).from(moment()) : null;
};

export const formatDateTime = (date) => {
  return date ? moment(date).format(FORMAT_DATETIME) : null;
};

export const formatDate = (date, formatString = FORMAT_DATE) => {
  return date ? moment(date).format(formatString) : null;
};

export const checkToday = (dateCheck) => {
  return dateCheck
    ? moment(dateCheck).format(FORMAT_DATE) ===
        moment(currentDate()).format(FORMAT_DATE)
    : false;
};

export const formatCurrencyVnd = (value, suffix = 'đ') => {
  if (!value) return 0 + suffix;
  return (
    `${value}`
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + '.') + prev;
      }) + suffix
  );
};

export const getPriceData = (productData, siteDate, quantity) => {
  const { product_price, final_wholesail_discount } = productData;
  const { conneted } = siteDate;
  let price = 0;
  let discount = 0;
  if (!product_price) return 0;
  if (product_price.length) {
    const currentPriceListIndex = product_price.findIndex((pl, index) => {
      const nextEl = product_price[index + 1];
      if (!nextEl) return true;
      if (quantity <= pl.quantity) return true;
      if (quantity >= pl.quantity && quantity < nextEl.quantity) return true;
      return false;
    });

    price =
      product_price[currentPriceListIndex]?.price || product_price[0].price;

    discount = final_wholesail_discount;
  } else {
    price = product_price.price;
    discount = product_price.discount || 0;
  }

  if (
    product_price &&
    Object.keys(product_price).length === 0 &&
    Object.getPrototypeOf(product_price) === Object.prototype
  ) {
    return {
      price: -1,
      discount: -1,
      discountPrice: 0,
      quantity,
      totalPriceDiscount: -1,
      totalPrice: -1,
    };
  }

  const discountPrice =
    discount && price ? (price / 100) * (100 - discount) : price;
  return {
    price,
    discount,
    discountPrice,
    quantity,
    totalPriceDiscount: quantity * discountPrice,
    totalPrice: quantity * price,
  };
};

export const formatTable = {
  localization: {
    body: {
      editRow: {
        saveTooltip: 'Đồng ý',
        cancelTooltip: 'Hủy',
      },
      editTooltip: 'Chỉnh sửa',
    },
    toolbar: {
      searchTooltip: 'Tìm kiếm',
      searchPlaceholder: 'Tìm kiếm',
      nRowsSelected: '{0} sản phẩm được chọn',
    },
    pagination: {
      labelRowsSelect: 'Dòng',
      labelDisplayedRows: ' {from}-{to} của {count}',
      firstTooltip: 'Trang đầu',
      previousTooltip: 'Trang trước',
      nextTooltip: 'Trang tiếp',
      lastTooltip: 'Trang cuối',
    },
  },
};

export const orderStatusColor = {
  pending: {
    color: '#A131AD',
  },
  confirmed: {
    color: '#6F6CEE',
  },
  canceled: {
    color: '#E35847',
  },
  shipping: {
    color: '#0B86D0',
  },
  received: {
    color: '#2DCF58',
  },
  packed: {
    color: '#C0C312',
  },
};

export const replaceImg = (e) => {
  e.target.src =
    'http://cheyenne19.com/assets/product/product_1610705237333_0.png';
};

export const COPYFLOW_VIEWTYPE = {
  LIST: 'list',
  DIAGRAM: 'diagram',
};

export const USER_ROLE = {
  OWNER: 'owner',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

export const listSidebar = [
  {
    label: 'Quản lý đơn hàng',
    key: 'order',
    iconNew: 'Order',
    childs: [
      {
        key: 'customer_order',
        label: 'Đơn bán',
        path: 'quan-ly-don-hang',
      },
      {
        key: 'my_order',
        label: 'Đơn mua',
        path: 'don-hang',
      },
    ],
  },
  {
    label: 'Liên kết',
    key: 'connect',
    iconNew: 'ConnectSite',
    childs: [
      {
        key: 'manage_connected_site',
        label: 'Công ty liên kết',
        path: 'quan-ly-trang-lien-ket',
      },
      {
        key: 'manage_connected_site',
        label: 'Khách hàng liên kết',
        path: 'quan-ly-trang-lien-ket/customer',
      },
    ],
  },
  {
    label: 'Quản lý sản phẩm',
    key: 'product',
    iconNew: 'Warehouse',
    childs: [
      {
        key: 'manage_product',
        label: 'Tất cả sản phẩm',
        path: 'quan-ly-san-pham',
      },
      {
        key: 'create_product',
        label: 'Thêm sản phẩm mới',
        path: 'tao-san-pham',
      },
      {
        key: 'copy_product',
        label: 'Copy sản phẩm',
        path: 'copy-san-pham',
      },
    ],
  },
  {
    label: 'Cài đặt',
    key: 'settings',
    iconNew: 'Setting',
    role: [USER_ROLE.OWNER],
    childs: [
      {
        key: 'settings',
        label: 'Cài đặt thông tin',
        path: 'cai-dat?tab=0',
      },
      {
        key: 'settings',
        label: 'Cài đặt giao diện',
        path: 'cai-dat?tab=1',
      },
      {
        key: 'settings',
        label: 'Cài đặt chia sẻ',
        path: 'cai-dat?tab=2',
      },
    ],
  },
  {
    label: 'Nhân viên',
    iconNew: 'ManageEmployee',
    role: [USER_ROLE.OWNER, USER_ROLE.MANAGER],
    key: 'employee',
    childs: [
      {
        key: 'employee',
        label: 'Danh sách nhân viên',
        path: 'quan-ly-nhan-vien',
      },
    ],
  },
  {
    label: 'Công cụ',
    key: 'tools',
    iconNew: 'Tool',
    childs: [
      {
        key: 'tools',
        label: 'Dây chuyền phân phối',
        path: 'day-chuyen-copy',
        seller_type: USER_TYPE.WHOLE_SALE,
      },
      {
        key: 'tools',
        label: 'Giấy ghi nhớ',
        path: 'note',
      },
    ],
  },
];
export const lookupRole = {
  owner: 'Chủ sở hữu',
  manager: 'Quản lý',
  employee: 'Nhân viên',
};

export const lookupTrackingAction = {
  order: 'Đơn hàng bán',
  buy_order: 'Đơn mua',
  cart: 'Giỏ hàng',
  connect: 'Liên kết',
  // memo: 'Giấy ghi nhớ',
  employee: 'Nhân viên',
};

export const trackingActionColor = {
  order: {
    color: '#A131AD',
    iconNew: 'Order',
  },
  buy_order: {
    color: '#AD314A',
    iconNew: 'Order',
  },
  cart: {
    color: '#C0C312',
    iconNew: 'Cart',
  },
  connect: {
    color: '#0B86D0',
    iconNew: 'ConnectSite',
  },
  // memo: {
  //   color: '#F1A250',
  // },
  employee: {
    color: '#2DCF58',
    iconNew: 'ManageEmployee',
  },
};
