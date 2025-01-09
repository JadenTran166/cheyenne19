import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  themeKey: '',
  themeKeySetting: '',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemKey: (state, action) => {
      state.themeKey = action.payload;
    },
    updateSettingTheme: (state, action) => {
      state.themeKeySetting = action.payload;
    },
    cancleConfigTheme: (state, action) => {
      state.themeKeySetting = '';
    },
  },
  extraReducers: {},
});

export const { updateSettingTheme, cancleConfigTheme, setThemKey } =
  themeSlice.actions;

export default themeSlice.reducer;
