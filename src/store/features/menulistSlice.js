import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  menu: JSON.parse(localStorage.getItem("menuList")) ?? [],
};

console.log(JSON.parse(localStorage.getItem("menuList")));
export const menulistSlice = createSlice({
  name: "menulist",
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

const { actions, reducer } = menulistSlice;
export const { SET_MENU } = actions;
export default reducer;
