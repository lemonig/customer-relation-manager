import { configureStore } from "@reduxjs/toolkit";
import loadSlice from "./features/loadSlice";
import userSlice from "./features/userSlice";
import menuSlice from "./features/menuSlice";
import menulistSlice from "./features/menulistSlice";
import tokenSlice from "./features/tokenSlice";

import { composeWithDevTools } from 'redux-devtools-extension';

import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    load: loadSlice,
    token: tokenSlice,
    menu: menulistSlice,
    user: userSlice,
    menuKey: menuSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
  // enhancers: (getDefaultEnhancers) =>
  //   getDefaultEnhancers().concat(monitorReducersEnhancer),
  devTools: process.env.NODE_ENV !== 'production',
});
