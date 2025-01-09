import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosService, { axiosAssetService } from 'config/axiosService';
import { Alert, setCookie } from 'utils';

/*
  ACTION
*/

export const authenticateUser = createAsyncThunk(
  'user/authen',
  async (token, { dispatch }) => {
    try {
      axiosService.setToken('Bearer ' + token);
      axiosAssetService.setToken('Bearer ' + token);

      const resData = await axiosService.get(`/admin/me`);
      axiosService.setToken('Bearer ' + token);
      axiosAssetService.setToken('Bearer ' + token);
      setCookie('germany_admin_token', token, 60);

      return resData.data;
    } catch (errors) {
      axiosService.deleteToken();
      axiosAssetService.deleteToken();
      setCookie('germany_admin_token', '', 0);

      return Promise.reject(errors.message);
    }
  }
);

export const logout = createAsyncThunk('user/logout', async (token) => {
  axiosService.post('/users/logout');
  axiosService.deleteToken();
  axiosAssetService.deleteToken();
  setCookie('germany_admin_token', '', 0);
});

export const updateColor = createAsyncThunk(
  'user/updateColor',
  async (data) => {
    return axiosService
      .patch('/business/admin', data)
      .then((res) => {
        let item = [];
        if (data.color) item.push('màu');
        if (data.avatar) item.push('ảnh đại diện');

        let title = `Cập nhật ${
          item.length > 0 ? item.join(', ') : ''
        } thành công!`;

        Alert.fire({
          icon: 'success',
          title: title,
          showConfirmButton: false,
        });
        return res.data;
      })
      .catch((err) => {
        Alert.fire({
          icon: 'error',
          title: 'Some thing wrong!',
          showConfirmButton: false,
        });
      });
  }
);

const initialState = {
  userData: {},
  isLoadingAuthen: true,
  isLogin: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    endLoadingAuthen: (state, action) => {
      state.isLoadingAuthen = false;
    },
    updateUserSiteData: (state, action) => {
      state.userData.site = { ...action.payload };
    },
    updateUserBusinessData: (state, action) => {
      state.userData.business = { ...action.payload };
    },
    updateUserSiteBannerData: (state, action) => {
      state.userData.site.banners = [...action.payload];
    },
  },
  extraReducers: {
    [authenticateUser.fulfilled]: (state, action) => {
      state.userData = { ...action.payload };
      state.isLogin = true;
    },
    [authenticateUser.rejected]: (state, action) => {
      state.userData = {};
      state.isLogin = false;
    },
    [logout.fulfilled]: (state, action) => {
      state.userData = {};
      state.isLogin = false;
    },
    [updateColor.fulfilled]: (state, action) => {
      state.userData.site = { ...action.payload };
    },
  },
});

export const {
  endLoadingAuthen,
  updateUserSiteBannerData,
  updateUserSiteData,
  updateUserBusinessData,
} = userSlice.actions;

export default userSlice.reducer;
