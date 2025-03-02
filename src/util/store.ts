import { configureStore, createSlice } from "@reduxjs/toolkit";
import UserInfo from "@/types/UserInfo";

const userInitialState: UserInfo = {
  _id: "",
  name: "",
  사업자번호: "",
  sex: "",
  주민번호: "",
  phone: "",
  address: {
    zip: "",
    mainAddress: "",
    subAddress: "",
  },
  sign: {},
  bankAccount: {
    bank: "",
    account: "",
  },
  email: "",
  password: "",
};

const user = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {},
});

const store = configureStore({
  reducer: {
    user: user.reducer,
  },
});

export default store;
