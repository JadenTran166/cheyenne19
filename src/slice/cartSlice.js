import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartTotalProduct: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartTotalProduct: (state, action) => {
      state.cartTotalProduct = action.payload;
    },
  },
  extraReducers: {},
});

export const { updateCartTotalProduct } = cartSlice.actions;

export default cartSlice.reducer;
