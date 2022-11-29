import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: "",
  menu: [],
};

export const tokenSlice = createSlice({
  name: "token",
  initialState: initialState.token,
  reducers: {
    SET_TOKEN: (state, { payload }) => {
      return (state = {
        ...state,
        token: payload,
      });
    },
  },
});

export const menuSlice = createSlice({
  name: "menu",
  initialState: initialState.menu,
  reducers: {
    SET_MENU: (state, { payload }) => {
      return (state = {
        ...state,
        menu: payload,
      });
    },
  },
});
export const { SET_MENU } = menuSlice.actions;
export const { SET_TOKEN } = tokenSlice.actions;

export const tokenSliceR = tokenSlice.reducer;
export const menuSliceR = menuSlice.reducer;
