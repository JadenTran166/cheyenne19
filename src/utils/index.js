/* eslint-disable no-useless-escape */
import * as moment from 'moment';
import 'moment/locale/vi';
import Swal from 'sweetalert2';
import axiosService from "../config/axiosService";
import {ENV_GERMANY_ENDPOINT} from "../env/local";

export const replaceStringBy = (str_origin, str_needToReplace, str_by) => {
  // function: Replace a str_needToReplace of string str_origin by str_by
  // input: original string, string that need to replace, string replace by
  // output: new string that replaced

  // Example:  replaceStringBy(fill:"#eeeee","#eeeee","#fffff")
  // Result : fill:"#fffff"

  const regex = new RegExp(`${str_needToReplace}`, 'g');

  let result = str_origin.replace(regex, `${str_by}`);
  return result;
};

export const setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};

export const getCookie = (cname) => {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

// export const formatTable = {
//   localization: {
//     body: {
//       editRow: {
//         saveTooltip: 'Đồng ý',
//         cancelTooltip: 'Hủy',
//       },
//       editTooltip: 'Chỉnh sửa',
//     },
//     toolbar: {
//       searchTooltip: 'Tìm kiếm',
//       searchPlaceholder: 'Tìm kiếm',
//       nRowsSelected: '{0} sản phẩm được chọn',
//     },
//     pagination: {
//       labelRowsSelect: 'Dòng',
//       labelDisplayedRows: ' {from}-{to} của {count}',
//       firstTooltip: 'Trang đầu',
//       previousTooltip: 'Trang trước',
//       nextTooltip: 'Trang tiếp',
//       lastTooltip: 'Trang cuối',
//     },
//   },
// };

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

export const formatDate = (date) => {
  return date ? moment(date).format(FORMAT_DATE) : null;
};

export const checkToday = (dateCheck) => {
  return dateCheck
    ? moment(dateCheck).format(FORMAT_DATE) ===
        moment(currentDate()).format(FORMAT_DATE)
    : false;
};

export const convertArrayToObject = (data, key) => {
  if (!key || !data[0][key]) return {};
  return data.reduce(
    (result, item) => ({ ...result, [item[key]]: { ...item } }),
    {}
  );
};

export const findValueInArrayeBy = (list = [], key, value) => {
  const curentIndex = list.findIndex((item) => item[key] === value);
  if (curentIndex < 0) return '';
  return list[curentIndex];
};

export const Alert = Swal.mixin({
  timer: 2000,
  confirmButtonText: 'Tiếp tục',
  cancelButtonText: 'Hủy',
});

export const checkUrl = (url) => {
  if (!url) return false;
  return (
    url.search(
      new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
      )
    ) >= 0
  );
};

export const formatAddress = (address, addressData) => {
  if (address && typeof address !== 'string' && addressData.length > 0) {
    const city = addressData.find((data) => data.code === address.state_code);

    const district = city.districts.find(
      (data) => data.codename === address.province_code
    );

    const ward = district.wards.find(
      (data) => data.codename === address.ward_code
    );

    return `${address.street}, ${ward.name}, ${district.name}, ${city.name}`;
  }
  return address;
};

export const stringToSlug = (string, isLowerCase = false) => {
  if (!string?.length) return string;
  if (isLowerCase) {
    string = string.toLowerCase();
  }

  return string
    .split(/\s/)
    .filter((item) => !!item)
    .join('_');
};

export const handleOtpNavigate = (userId, url) => {
  axiosService
      .post('/users/otp-generate')
      .then((res) => {
        const { otp } = res.data;
        const link = `${ENV_GERMANY_ENDPOINT}${url}?otp=${otp.key}&id=${userId}`;
        window.location.href = link;
      })
      .catch((err) => {
        alert(err);
        console.error(err);
      });
}
