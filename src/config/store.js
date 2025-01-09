import { configureStore, createReducer } from '@reduxjs/toolkit';
import userReducer from 'slice/userSlice';
import themeReducer from 'slice/themeSlice';
import globalReducer from 'slice/global';
import productReducer from 'slice/productSlice';
import cartReducer from 'slice/cartSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    global: globalReducer,
    product: productReducer,
    cart: cartReducer,
  },
});
