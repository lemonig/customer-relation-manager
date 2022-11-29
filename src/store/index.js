import { configureStore } from "@reduxjs/toolkit";
import loadSlice from "./festures/loadSlice";
import { tokenSliceR, menuSliceR } from "./festures/userSlice";

const store = configureStore({
  reducer: {
    load: loadSlice,
    token: tokenSliceR,
    menu: menuSliceR,
  },
});
export default store;
