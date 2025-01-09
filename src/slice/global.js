import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosService from 'config/axiosService';

const initialState = {
  prevLocationPath: '',
  isLoadingOverlay: false,
  initData: {
    businessResource: {
      form: [],
      model: [],
      scale: [],
    },
    provinces: [],
    roles: [],
    orderStatus: [],
    category: [],
  },
  isLoadingInitData: true,
};

export const getInitData = createAsyncThunk(
  'global/initData',
  async (token, { dispatch }) => {
    dispatch(setLoadingInit(true));
    try {
      let saveProvinces = window.localStorage.getItem('provinces');

      if (saveProvinces) {
        try {
          saveProvinces = JSON.parse(saveProvinces);
        } catch (error) {
          console.error(error);
        }
      } else {
        const resProvinces = await axiosService.get('/provinces');
        window.localStorage.setItem(
          'provinces',
          JSON.stringify(resProvinces.data)
        );
        saveProvinces = resProvinces.data;
      }

      const [roleData, orderStatusData, categoryData] = await Promise.all([
        axiosService.get('/roles').then((res) => res.data),
        axiosService.get('/order-status').then((res) => res.data),
        axiosService.get('/category').then((res) => res.data),
      ]);

      return {
        provinces: saveProvinces,
        roles: roleData,
        orderStatus: orderStatusData,
        category: categoryData,
      };
    } catch (errors) {
      return Promise.reject(errors.message);
    }
  }
);

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    updatePrevLocationPath: (state, action) => {
      state.prevLocationPath = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoadingOverlay = action.payload;
    },
    setLoadingInit: (state, action) => {
      state.isLoadingInitData = action.payload;
    },
    setBusinessResource: (state, action) => {
      state.initData.businessResource = action.payload;
    },
  },
  extraReducers: {
    [getInitData.fulfilled]: (state, action) => {
      state.initData.provinces = [...action.payload.provinces];
      state.initData.roles = [...action.payload.roles];
      state.initData.orderStatus = [...action.payload.orderStatus];
      state.initData.category = [...action.payload.category];
      state.isLoadingInitData = false;
    },
    [getInitData.rejected]: (state, action) => {
      state.isLoadingInitData = false;
    },
  },
});

export const {
  updatePrevLocationPath,
  setLoading,
  setBusinessResource,
  setLoadingInit,
} = globalSlice.actions;

export default globalSlice.reducer;
