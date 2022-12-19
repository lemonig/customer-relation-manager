import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  key: sessionStorage.getItem("menuKey") ?? "1",
  openKey: JSON.parse(sessionStorage.getItem("openKey")) ?? [],
};

export const menuSlice = createSlice({
  name: "menuKey",
  initialState,
  reducers: {
    SELECT_MENU: (state, { payload }) => {
      sessionStorage.setItem("menuKey", payload);
      return (state = {
        ...state,
        key: payload,
      });
    },
    OPEN_EKY: (state, { payload }) => {
      sessionStorage.setItem("openKey", JSON.stringify(payload));
      return (state = {
        ...state,
        openKey: payload,
      });
    },
  },
});

export const { SELECT_MENU } = menuSlice.actions;
export const { OPEN_EKY } = menuSlice.actions;

export default menuSlice.reducer;
