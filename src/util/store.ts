import { configureStore } from "@reduxjs/toolkit";
import registerUserInfoReducer from "./slices/registerUserInfoSlice";

export const store = configureStore({
  reducer: {
    registerUserInfo: registerUserInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
