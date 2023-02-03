import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  showLoading: false, //加载交互效果
  loadType: "top",
  loadText: "",
};

export const loadSlice = createSlice({
  name: "load",
  initialState,
  reducers: {
    PUSH_LOADING: (state, { payload }) => {
      state.showLoading = true;
    },
    SHIFT_LOADING: (state) => {
      state.showLoading = false;
    },
  },
});
export const { PUSH_LOADING, SHIFT_LOADING } = loadSlice.actions;

export default loadSlice.reducer;
