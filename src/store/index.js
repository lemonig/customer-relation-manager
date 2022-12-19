import { configureStore } from "@reduxjs/toolkit";
import { loadSlice } from "./features/loadSlice";
import { tokenSliceR, menuSliceR } from "./features/userSlice";
import menuSlice from "./features/menuSlice";

export const store = configureStore({
  reducer: {
    load: loadSlice,
    token: tokenSliceR,
    menu: menuSliceR,
    menuKey: menuSlice,
  },
});
