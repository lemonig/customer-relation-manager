import { configureStore } from "@reduxjs/toolkit";
import loadSlice from "./features/loadSlice";
import { tokenReucer, userReucer } from "./features/userSlice";
import menuSlice from "./features/menuSlice";
import menulistSlice from "./features/menulistSlice";

export const store = configureStore({
  reducer: {
    load: loadSlice,
    token: tokenReucer,
    menu: menulistSlice,
    user: userReucer,
    menuKey: menuSlice,
  },
});
