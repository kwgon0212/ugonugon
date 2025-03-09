import { configureStore } from "@reduxjs/toolkit";
import registerUserInfoReducer from "./slices/registerUserInfoSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    registerUserInfo: registerUserInfoReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
