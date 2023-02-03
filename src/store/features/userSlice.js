import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: "",
  menu: [],
  user: {},
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

export const userSlice = createSlice({
  name: "user",
  initialState: initialState.user,
  reducers: {
    SET_USER: (state, { payload }) => {
      return (state = {
        ...state,
        ...payload,
      });
    },
  },
});

export const { SET_MENU } = menuSlice.actions;
export const { SET_TOKEN } = tokenSlice.actions;
export const { SET_USER } = userSlice.actions;

export const tokenReucer = tokenSlice.reducer;
export const menuReucer = menuSlice.reducer;
export const userReucer = userSlice.reducer;
