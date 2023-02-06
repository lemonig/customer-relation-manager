import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: "",
  menu: JSON.parse(localStorage.getItem("menuList")) ?? [],
  user: JSON.parse(localStorage.getItem("uesr")) ?? {},
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

export const userSlice = createSlice({
  name: "user",
  initialState: initialState.user,
  reducers: {
    SET_USER: (state, { payload }) => {
      return (state = {
        ...state,
        user: payload,
      });
    },
  },
});

export const { SET_TOKEN } = tokenSlice.actions;
export const { SET_USER } = userSlice.actions;

export const tokenReucer = tokenSlice.reducer;
export const userReucer = userSlice.reducer;
