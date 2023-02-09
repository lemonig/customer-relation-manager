import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userInfo, menuInfo } from "@Api/user.js";

const initialState = localStorage.getItem("menuList")
  ? JSON.parse(localStorage.getItem("menuList"))
  : [];

const getRouteMenu = async () => {
  let { data } = await menuInfo();
  data[0].index = true;
  data.map((item) => {
    if (!item.visible) {
      delete item.pid;
    }
  });
  localStorage.setItem("menuList", JSON.stringify(data));
};

export const getRouteMenuD = createAsyncThunk();

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
