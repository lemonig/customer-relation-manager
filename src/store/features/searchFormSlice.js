import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  form: {},
  condition: null
};

export const loadSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    SAVE_FORM: (state, { payload }) => {
      state.form = payload;
    },
    DELETE_FORM: (state) => {
      state.form = {};
    },
    SAVE_CONDITION: (state, { payload }) => {
      state.condition = payload;
    },
  },

});

const { actions, reducer } = loadSlice;

export const { SAVE_FORM, SHIFT_LOADING, SAVE_CONDITION, } = actions;

export default reducer;
