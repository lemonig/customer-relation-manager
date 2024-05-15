import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userIdList: [],
};

export const treeStaffSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    SAVE_ID: (state, { payload }) => {
      state.userIdList = payload;
    },
    DELETE_ID: (state) => {
      state.userIdList = [];
    },

  },

});

const { actions, reducer } = treeStaffSlice;

export const { SAVE_ID, DELETE_ID } = actions;

export default reducer;
