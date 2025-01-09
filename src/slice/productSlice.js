import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productName: '',
  productCate: {},
  productSubCate: {},
  country: '',
  unit: '',
  hscode: '',
  barcode: '',
  instruction: '',
  preservation: '',
  weight: '',
  description: '',
  ingredients: [],
  nutritional_ingredients: [],
  have_ingredients: false,
  have_nutritional_ingredients: false,
};

export const productSlice = createSlice({  
  name: 'product',
  initialState,
  reducers: {
    updateProductName: (state, action) => {
      state.productName = action.payload;
    },
    updateProductCate: (state, action) => {
      state.productCate = action.payload;
    },
    updateProductSubCate: (state, action) => {
      state.productSubCate = action.payload;
    },
    updateProductInfo: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearProductData: (state, action) => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: {},
});

export const {
  updateProductName,
  updateProductCate,
  updateProductSubCate,
  updateProductInfo,
  clearProductData,
} = productSlice.actions;

export default productSlice.reducer;
