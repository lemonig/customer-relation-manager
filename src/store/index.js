import { configureStore } from "@reduxjs/toolkit";
import loadSlice from "./features/loadSlice";
import { menuReucer, tokenReucer, userReucer } from "./features/userSlice";
import menuSlice from "./features/menuSlice";

export const store = configureStore({
  reducer: {
    load: loadSlice,
    token: tokenReucer,
    menu: menuReucer,
    user: userReucer,
    menuKey: menuSlice,
  },
});
