import { createSlice } from "@reduxjs/toolkit";
const initialState = localStorage.getItem("menuList")
  ? JSON.parse(localStorage.getItem("menuList"))
  : [];

export const menulistSlice = createSlice({
  name: "menulist",
  initialState: initialState,
  reducers: {
    SET_MENU: (state, { payload }) => {
      state = payload;
      // return (state = {
      //   ...state,
      //   menu: payload,
      // });
    },
  },
});

const { actions, reducer } = menulistSlice;
export const { SET_MENU } = actions;
export default reducer;
