import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./Services/authapi";
import authReducer from "./Services/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
     auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
