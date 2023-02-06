import { configureStore } from "@reduxjs/toolkit";
import loadSlice from "./features/loadSlice";
import userSlice from "./features/userSlice";
import menuSlice from "./features/menuSlice";
import menulistSlice from "./features/menulistSlice";
import tokenSlice from "./features/tokenSlice";

export const store = configureStore({
  reducer: {
    load: loadSlice,
    token: tokenSlice,
    menu: menulistSlice,
    user: userSlice,
    menuKey: menuSlice,
  },
});
